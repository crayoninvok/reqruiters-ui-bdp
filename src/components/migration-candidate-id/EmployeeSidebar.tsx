// EmployeeSidebar Component
import { FileText, Edit, User } from "lucide-react";
import { HiredEmployeeService } from "@/services/hired.service";
import {
  HiredEmployee,
} from "@/types/types";

interface EmployeeSidebarProps {
  employee: HiredEmployee;
  subordinatesCount: number;
  onEditEmployee: () => void;
}

export const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({
  employee,
  subordinatesCount,
  onEditEmployee,
}) => {
  const duration = HiredEmployeeService.calculateEmploymentDuration(
    employee.startDate,
    employee.terminationDate
  );
  const isInProbation = HiredEmployeeService.isProbationPeriod(
    employee.startDate,
    employee.probationEndDate
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Stats
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {employee.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Duration</span>
            <span className="font-medium text-gray-900 dark:text-white">{duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subordinates</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {subordinatesCount}
            </span>
          </div>
          {isInProbation && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Probation</span>
              <span className="font-medium text-orange-600 dark:text-orange-400">
                Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <FileText className="w-4 h-4" />
            View Documents
          </button>
          <button
            onClick={onEditEmployee}
            className="w-full flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Employee
          </button>
        </div>
      </div>

      {/* Processed By */}
      {employee.processedBy && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Processed By
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {employee.processedBy.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {employee.processedBy.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};