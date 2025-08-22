"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, XCircle } from "lucide-react";
import { HiredEmployeeService } from "@/services/hired.service";
import {
  HiredEmployee,
  SupervisorOption,
  UpdateEmployeeData,
  TerminateEmployeeData,
  Position
} from "@/types/types";
import { EmployeeHeader } from "@/components/migration-candidate-id/EmployeeHeader";
import { EmployeeTabs } from "@/components/migration-candidate-id/EmployeeTabs";
import { EmployeeContent } from "@/components/migration-candidate-id/EmployeeContent";
import { EmployeeSidebar } from "@/components/migration-candidate-id/EmployeeSidebar"; 
import { EditEmployeeModal } from "@/components/migration-candidate-id/EditEmployeeModal";
import { TerminateEmployeeModal } from "@/components/migration-candidate-id/TerminateEmployeeModal";
import { LoadingState } from "@/components/migration-candidate-id/LoadingState";
import { ErrorState } from "@/components/migration-candidate-id/ErrorState";
import { withAuthGuard } from "@/components/withGuard";

// Define the subordinate type
interface SubordinateEmployee {
  id: string;
  fullName: string;
  employeeId: string;
  hiredPosition: Position;
}

const EmployeeDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const employeeId = params?.id as string;

  // State
  const [employee, setEmployee] = useState<HiredEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subordinates, setSubordinates] = useState<SubordinateEmployee[]>([]);
  const [supervisors, setSupervisors] = useState<SupervisorOption[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [terminating, setTerminating] = useState(false);

  // Form states
  const [editData, setEditData] = useState<UpdateEmployeeData>({});
  const [terminateData, setTerminateData] = useState<TerminateEmployeeData>({
    terminationDate: "",
    terminationReason: "",
  });

  // Effects
  useEffect(() => {
    if (employeeId) {
      loadEmployeeData();
      loadSubordinates();
      loadSupervisors();
    }
  }, [employeeId]);

  // Data loading functions
  const loadEmployeeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await HiredEmployeeService.getHiredEmployeeById(employeeId);
      setEmployee(response.employee);
      
      // Initialize edit data
      setEditData({
        hiredPosition: response.employee.hiredPosition,
        department: response.employee.department,
        employmentStatus: response.employee.employmentStatus,
        contractType: response.employee.contractType,
        basicSalary: response.employee.basicSalary,
        workLocation: response.employee.workLocation,
        shiftPattern: response.employee.shiftPattern,
        supervisorId: response.employee.supervisorId,
        emergencyContactName: response.employee.emergencyContactName,
        emergencyContactPhone: response.employee.emergencyContactPhone,
        probationEndDate: response.employee.probationEndDate,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  const loadSubordinates = async () => {
    try {
      const response = await HiredEmployeeService.getEmployeeSubordinates(employeeId);
      setSubordinates(response.subordinates);
    } catch (err) {
      console.error("Failed to load subordinates:", err);
    }
  };

  const loadSupervisors = async () => {
    try {
      const response = await HiredEmployeeService.getAvailableSupervisors();
      setSupervisors(response.supervisors);
    } catch (err) {
      console.error("Failed to load supervisors:", err);
    }
  };

  // Action handlers
  const handleUpdateEmployee = async () => {
    setUpdating(true);
    try {
      const validation = HiredEmployeeService.validateUpdateData(editData);
      if (validation.length > 0) {
        setError(validation.join(", "));
        return;
      }

      await HiredEmployeeService.updateHiredEmployee(employeeId, editData);
      setShowEditModal(false);
      setError(null);
      await loadEmployeeData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update employee");
    } finally {
      setUpdating(false);
    }
  };

  const handleTerminateEmployee = async () => {
    setTerminating(true);
    try {
      const validation = HiredEmployeeService.validateTerminationData(terminateData);
      if (validation.length > 0) {
        setError(validation.join(", "));
        return;
      }

      await HiredEmployeeService.terminateEmployee(employeeId, terminateData);
      setShowTerminateModal(false);
      setError(null);
      await loadEmployeeData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to terminate employee");
    } finally {
      setTerminating(false);
    }
  };

  const handleReactivateEmployee = async () => {
    try {
      await HiredEmployeeService.reactivateEmployee(employeeId);
      setError(null);
      await loadEmployeeData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reactivate employee");
    }
  };

  // Render states
  if (loading) {
    return <LoadingState />;
  }

  if (error && !employee) {
    return <ErrorState error={error} onBack={() => router.back()} />;
  }

  if (!employee) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <EmployeeHeader
        employee={employee}
        onBack={() => router.back()}
        onEdit={() => setShowEditModal(true)}
        onTerminate={() => setShowTerminateModal(true)}
        onReactivate={handleReactivateEmployee}
      />

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50/90 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300 backdrop-blur-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <EmployeeTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <EmployeeContent
            employee={employee}
            activeTab={activeTab}
            subordinates={subordinates}
            onNavigateToEmployee={(id) => router.push(`/hired/${id}`)}
          />
        </div>

        {/* Sidebar */}
        <div>
          <EmployeeSidebar
            employee={employee}
            subordinatesCount={subordinates.length}
            onEditEmployee={() => router.push(`/hired/${employeeId}/edit`)}
          />
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
  <EditEmployeeModal
    employee={employee}
    isOpen={showEditModal}
    onClose={() => setShowEditModal(false)}
    onSuccess={(updatedEmployee) => {
      setEmployee(updatedEmployee);
      setShowEditModal(false);
      // Optional: Show success message
    }}
  />
)}

      {showTerminateModal && (
        <TerminateEmployeeModal
          terminateData={terminateData}
          terminating={terminating}
          onClose={() => setShowTerminateModal(false)}
          onTerminate={handleTerminateEmployee}
          onChange={setTerminateData}
        />
      )}
    </div>
  );
};

export default withAuthGuard(EmployeeDetailPage);