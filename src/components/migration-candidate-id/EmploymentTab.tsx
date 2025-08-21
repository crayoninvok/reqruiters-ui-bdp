import React from "react";
import { Briefcase, DollarSign } from "lucide-react";
import { HiredEmployee } from "@/types/types";
import { HiredEmployeeService } from "@/services/hired.service";

interface EmploymentTabProps {
  employee: HiredEmployee;
}

export const EmploymentTab: React.FC<EmploymentTabProps> = ({ employee }) => {
  const formatted = HiredEmployeeService.formatEmployeeData(employee);
  const duration = HiredEmployeeService.calculateEmploymentDuration(
    employee.startDate,
    employee.terminationDate
  );

  return (
    <>
      {/* Employment Details */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <p className="text-gray-900 dark:text-white font-medium">
                {HiredEmployeeService.getDepartmentDisplayName(employee.department)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Type
              </label>
              <p className="text-gray-900 dark:text-white">{employee.contractType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Shift Pattern
              </label>
              <p className="text-gray-900 dark:text-white">
                {HiredEmployeeService.getShiftPatternDisplay(employee.shiftPattern)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Work Location
              </label>
              <p className="text-gray-900 dark:text-white">
                {employee.workLocation || "Not specified"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hired Date
              </label>
              <p className="text-gray-900 dark:text-white">
                {formatted.formattedHiredDate}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employment Duration
              </label>
              <p className="text-gray-900 dark:text-white">{duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compensation */}
      {employee.basicSalary && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Compensation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Basic Salary
              </label>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatted.formattedSalary}
              </p>
            </div>
            {employee.allowances && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Allowances
                </label>
                <p className="text-gray-900 dark:text-white">
                  Additional benefits included
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};