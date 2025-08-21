import React from "react";
import {
  User,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { HiredEmployee, EmploymentStatus } from "@/types/types";
import { HiredEmployeeService } from "@/services/hired.service";

interface OverviewTabProps {
  employee: HiredEmployee;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ employee }) => {
  const formatted = HiredEmployeeService.formatEmployeeData(employee);
  const isInProbation = HiredEmployeeService.isProbationPeriod(
    employee.startDate,
    employee.probationEndDate
  );

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

  return (
    <>
      {/* Basic Information */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {employee.recruitmentForm?.fullName || "-"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee ID
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {employee.employeeId}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Applied Position
            </label>
            <p className="text-gray-900 dark:text-white">
              {employee.recruitmentForm?.appliedPosition
                ? HiredEmployeeService.getPositionDisplayName(
                    employee.recruitmentForm.appliedPosition
                  )
                : "-"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hired Position
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {HiredEmployeeService.getPositionDisplayName(employee.hiredPosition)}
            </p>
          </div>
        </div>
      </div>

      {/* Employment Status */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Employment Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(employee.employmentStatus)}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {HiredEmployeeService.getEmploymentStatusDisplay(employee.employmentStatus).label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Status</p>
              </div>
            </div>

            {isInProbation && (
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Currently in probation period</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <p className="text-gray-900 dark:text-white">
                {formatted.formattedStartDate}
              </p>
            </div>
            {employee.probationEndDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Probation End Date
                </label>
                <p className="text-gray-900 dark:text-white">
                  {formatted.formattedProbationEndDate}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};