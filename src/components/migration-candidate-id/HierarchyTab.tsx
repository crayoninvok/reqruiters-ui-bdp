// HierarchyTab Component
import { Shield, Users, User, Eye } from "lucide-react";
import { HiredEmployeeService } from "@/services/hired.service";
import {
  HiredEmployee,
  EmploymentStatus,
  Department,
  Position,
  ContractType,
  ShiftPattern,
  SupervisorOption,
  UpdateEmployeeData,
  TerminateEmployeeData,
} from "@/types/types";

interface SubordinateEmployee {
  id: string;
  fullName: string;
  employeeId: string;
  hiredPosition: Position;
}

interface HierarchyTabProps {
  employee: HiredEmployee;
  subordinates: SubordinateEmployee[];
  onNavigateToEmployee: (id: string) => void;
}

export const HierarchyTab: React.FC<HierarchyTabProps> = ({
  employee,
  subordinates,
  onNavigateToEmployee,
}) => {
  return (
    <div className="space-y-6">
      {/* Supervisor */}
      {employee.supervisor && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Supervisor
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {employee.supervisor.recruitmentForm.fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {employee.supervisor.employeeId}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subordinates */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Subordinates ({subordinates.length})
        </h3>
        {subordinates.length > 0 ? (
          <div className="space-y-3">
            {subordinates.slice(0, 5).map((subordinate) => (
              <div
                key={subordinate.id}
                className="flex items-center gap-4 p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {subordinate.fullName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subordinate.employeeId} •{" "}
                    {HiredEmployeeService.getPositionDisplayName(subordinate.hiredPosition)}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToEmployee(subordinate.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
            {subordinates.length > 5 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                And {subordinates.length - 5} more subordinates
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No subordinates</p>
        )}
      </div>
    </div>
  );
};