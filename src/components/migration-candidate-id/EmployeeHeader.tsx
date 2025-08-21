import React from "react";
import {
  ArrowLeft,
  Edit,
  UserX,
  UserCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
} from "lucide-react";
import { HiredEmployee, EmploymentStatus } from "@/types/types";
import { HiredEmployeeService } from "@/services/hired.service";

interface EmployeeHeaderProps {
  employee: HiredEmployee;
  onBack: () => void;
  onEdit: () => void;
  onTerminate: () => void;
  onReactivate: () => void;
}

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  employee,
  onBack,
  onEdit,
  onTerminate,
  onReactivate,
}) => {
  const getStatusIcon = (status: EmploymentStatus) => {
    switch (status) {
      case "PERMANENT":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PROBATION":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "CONTRACT":
        return <User className="w-5 h-5 text-blue-600" />;
      case "TERMINATED":
      case "RESIGNED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const duration = HiredEmployeeService.calculateEmploymentDuration(
    employee.startDate,
    employee.terminationDate
  );

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onBack}
          className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {employee.recruitmentForm?.fullName || "Employee Details"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {employee.employeeId} • {HiredEmployeeService.getDepartmentDisplayName(employee.department)}
          </p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg">
        <div className="flex items-center gap-4">
          {getStatusIcon(employee.employmentStatus)}
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {HiredEmployeeService.getEmploymentStatusDisplay(employee.employmentStatus).label}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {duration} • {HiredEmployeeService.getPositionDisplayName(employee.hiredPosition)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {employee.isActive && (
            <>
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={onTerminate}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                <UserX className="w-4 h-4" />
                Terminate
              </button>
            </>
          )}
          {!employee.isActive && (
            <button
              onClick={onReactivate}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <UserCheck className="w-4 h-4" />
              Reactivate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};