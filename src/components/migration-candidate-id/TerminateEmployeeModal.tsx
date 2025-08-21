// TerminateEmployeeModal Component
import { TerminateEmployeeData } from "@/types/types";

interface TerminateEmployeeModalProps {
  terminateData: TerminateEmployeeData;
  terminating: boolean;
  onClose: () => void;
  onTerminate: () => void;
  onChange: (data: TerminateEmployeeData) => void;
}

export const TerminateEmployeeModal: React.FC<TerminateEmployeeModalProps> = ({
  terminateData,
  terminating,
  onClose,
  onTerminate,
  onChange,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Terminate Employee
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            This action will mark the employee as terminated
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Termination Date
            </label>
            <input
              type="date"
              value={terminateData.terminationDate}
              onChange={(e) =>
                onChange({
                  ...terminateData,
                  terminationDate: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Termination Reason
            </label>
            <textarea
              value={terminateData.terminationReason}
              onChange={(e) =>
                onChange({
                  ...terminateData,
                  terminationReason: e.target.value,
                })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter the reason for termination..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onTerminate}
            disabled={terminating}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {terminating ? "Terminating..." : "Terminate Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};