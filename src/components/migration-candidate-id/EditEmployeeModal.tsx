import React, { useState, useEffect } from "react";
import { AlertCircle, X, Loader2 } from "lucide-react";
import {
  UpdateEmployeeData,
  SupervisorOption,
  Position,
  Department,
  EmploymentStatus,
  ContractType,
  ShiftPattern,
  HiredEmployee,
} from "@/types/types";
import { HiredEmployeeService } from "@/services/hired.service";

interface EditEmployeeModalProps {
  employee: HiredEmployee;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedEmployee: HiredEmployee) => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  employee,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // State
  const [editData, setEditData] = useState<UpdateEmployeeData>({});
  const [originalData, setOriginalData] = useState<UpdateEmployeeData>({});
  const [supervisors, setSupervisors] = useState<SupervisorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen && employee) {
      initializeFormData();
      loadSupervisors();
    }
  }, [isOpen, employee]);

  // Track unsaved changes
  useEffect(() => {
    if (Object.keys(originalData).length > 0) {
      const fieldsToCheck: (keyof UpdateEmployeeData)[] = [
        'hiredPosition', 'department', 'employmentStatus', 'contractType',
        'basicSalary', 'workLocation', 'shiftPattern', 'supervisorId',
        'emergencyContactName', 'emergencyContactPhone', 'probationEndDate'
      ];
      
      const hasChanges = HiredEmployeeService.hasUnsavedChanges(
        originalData,
        editData,
        fieldsToCheck
      );
      setHasUnsavedChanges(hasChanges);
    }
  }, [editData, originalData]);

  const initializeFormData = () => {
    const initialData: UpdateEmployeeData = {
      hiredPosition: employee.hiredPosition,
      department: employee.department,
      employmentStatus: employee.employmentStatus,
      contractType: employee.contractType,
      basicSalary: employee.basicSalary,
      workLocation: employee.workLocation,
      shiftPattern: employee.shiftPattern,
      supervisorId: employee.supervisorId,
      emergencyContactName: employee.emergencyContactName,
      emergencyContactPhone: employee.emergencyContactPhone,
      probationEndDate: employee.probationEndDate,
    };

    setEditData(initialData);
    setOriginalData(initialData);
    setErrors([]);
    setHasUnsavedChanges(false);
  };

  const loadSupervisors = async () => {
    setLoading(true);
    try {
      const response = await HiredEmployeeService.getAvailableSupervisors(employee.department);
      const filteredSupervisors = HiredEmployeeService.getFilteredSupervisors(
        response.supervisors,
        employee.department,
        employee.id
      );
      setSupervisors(filteredSupervisors);
    } catch (error: any) {
      console.error("Failed to load supervisors:", error);
      setErrors(["Failed to load supervisor options"]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateEmployeeData, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const validationErrors = HiredEmployeeService.validateUpdateDataEnhanced({
      ...editData,
      currentEmployeeId: employee.id,
      availableSupervisors: supervisors,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setErrors([]);

    try {
      const response = await HiredEmployeeService.updateHiredEmployee(employee.id, editData);
      
      // Create audit log entry
      const auditEntry = HiredEmployeeService.generateAuditLogEntry(
        'update',
        { employeeId: employee.employeeId, fullName: employee.recruitmentForm?.fullName },
        HiredEmployeeService.formatChangesForDisplay(originalData, editData, {
          hiredPosition: 'Position',
          department: 'Department',
          employmentStatus: 'Employment Status',
          contractType: 'Contract Type',
          basicSalary: 'Basic Salary',
          workLocation: 'Work Location',
          shiftPattern: 'Shift Pattern',
          supervisorId: 'Supervisor',
          emergencyContactName: 'Emergency Contact Name',
          emergencyContactPhone: 'Emergency Contact Phone',
          probationEndDate: 'Probation End Date',
        })
      );
      
      console.log('Employee update audit:', auditEntry);
      
      onSuccess(response.employee);
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update employee";
      setErrors([errorMessage]);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges && !saving) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close without saving?"
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  const getChangedFields = () => {
    if (!hasUnsavedChanges) return [];
    
    return HiredEmployeeService.formatChangesForDisplay(
      originalData,
      editData,
      {
        hiredPosition: 'Position',
        department: 'Department',
        employmentStatus: 'Employment Status',
        contractType: 'Contract Type',
        basicSalary: 'Basic Salary',
        workLocation: 'Work Location',
        shiftPattern: 'Shift Pattern',
        supervisorId: 'Supervisor',
        emergencyContactName: 'Emergency Contact Name',
        emergencyContactPhone: 'Emergency Contact Phone',
        probationEndDate: 'Probation End Date',
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Employee
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {employee.employeeId} - {employee.recruitmentForm?.fullName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={saving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-6 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading supervisor options...
          </div>
        )}

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="m-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Please fix the following errors:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Changes Preview */}
        {hasUnsavedChanges && (
          <div className="m-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Pending Changes:
            </h4>
            <div className="space-y-1">
              {getChangedFields().map((change, index) => (
                <div key={index} className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>{change.label}:</strong> {change.from} → {change.to}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Content */}
        {!loading && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position *
                </label>
                <select
                  value={editData.hiredPosition || ""}
                  onChange={(e) => handleInputChange('hiredPosition', e.target.value as Position)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={saving}
                >
                  {Object.values(Position).map((pos) => (
                    <option key={pos} value={pos}>
                      {HiredEmployeeService.getPositionDisplayName(pos)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department *
                </label>
                <select
                  value={editData.department || ""}
                  onChange={(e) => {
                    handleInputChange('department', e.target.value as Department);
                    // Reload supervisors when department changes
                    if (e.target.value !== employee.department) {
                      loadSupervisors();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={saving}
                >
                  {Object.values(Department).map((dept) => (
                    <option key={dept} value={dept}>
                      {HiredEmployeeService.getDepartmentDisplayName(dept)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employment Status *
                </label>
                <select
                  value={editData.employmentStatus || ""}
                  onChange={(e) => handleInputChange('employmentStatus', e.target.value as EmploymentStatus)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={saving}
                >
                  {Object.values(EmploymentStatus).map((status) => (
                    <option key={status} value={status}>
                      {HiredEmployeeService.getEmploymentStatusDisplay(status).label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contract Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contract Type *
                </label>
                <select
                  value={editData.contractType || ""}
                  onChange={(e) => handleInputChange('contractType', e.target.value as ContractType)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={saving}
                >
                  {Object.values(ContractType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Pattern */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shift Pattern *
                </label>
                <select
                  value={editData.shiftPattern || ""}
                  onChange={(e) => handleInputChange('shiftPattern', e.target.value as ShiftPattern)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={saving}
                >
                  {Object.values(ShiftPattern).map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {HiredEmployeeService.getShiftPatternDisplay(pattern)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Supervisor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Supervisor
                </label>
                <select
                  value={editData.supervisorId || ""}
                  onChange={(e) => handleInputChange('supervisorId', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={saving}
                >
                  <option value="">No Supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.fullName} ({supervisor.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Basic Salary (IDR)
                </label>
                <input
                  type="number"
                  value={editData.basicSalary || ""}
                  onChange={(e) => handleInputChange('basicSalary', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter salary amount"
                  min="0"
                  max="1000000000"
                  disabled={saving}
                />
                {editData.basicSalary && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(editData.basicSalary)}
                  </p>
                )}
              </div>

              {/* Work Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Location
                </label>
                <input
                  type="text"
                  value={editData.workLocation || ""}
                  onChange={(e) => handleInputChange('workLocation', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter work location"
                  disabled={saving}
                />
              </div>

              {/* Emergency Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={editData.emergencyContactName || ""}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter emergency contact name"
                  disabled={saving}
                />
              </div>

              {/* Emergency Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  type="text"
                  value={editData.emergencyContactPhone || ""}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+62 or 08xxxxxxxxxx"
                  disabled={saving}
                />
              </div>

              {/* Probation End Date (conditional) */}
              {editData.employmentStatus === "PROBATION" && (
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Probation End Date
                  </label>
                  <input
                    type="date"
                    value={editData.probationEndDate || ""}
                    onChange={(e) => handleInputChange('probationEndDate', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={saving}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {hasUnsavedChanges ? (
              <span className="text-orange-600 dark:text-orange-400">
                • You have unsaved changes
              </span>
            ) : (
              "No pending changes"
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};