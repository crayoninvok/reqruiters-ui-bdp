import React, { useState } from "react";
import {
  RecruitmentFormService,
} from "@/services/recruitment.service";
import {
  RecruitmentForm,
  Position,
  Department,
  ContractType,
  ShiftPattern,
  MigrateToHiredRequest,
} from "@/types/types";
import Swal from "sweetalert2";

interface MigrationModalProps {
  candidate: RecruitmentForm;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MigrateToHiredRequest>({
    recruitmentFormId: candidate.id,
    hiredPosition:
      candidate.appliedPosition || Position.PRODUCTION_GROUP_LEADER,
    department: Department.PRODUCTION_ENGINEERING,
    startDate: new Date().toISOString().split("T")[0],
    contractType: ContractType.PERMANENT,
    shiftPattern: ShiftPattern.DAY_SHIFT,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = RecruitmentFormService.validateMigrationData(formData);
    if (errors.length > 0) {
      Swal.fire({
        title: "Validation Error",
        html: errors.map((error) => `• ${error}`).join("<br>"),
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await RecruitmentFormService.migrateToHiredEmployee(
        formData
      );

      await Swal.fire({
        title: "Success!",
        text: `${candidate.fullName} has been successfully migrated to employee records with ID: ${response.hiredEmployee.employeeId}`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Migration error:", error);
      Swal.fire({
        title: "Migration Failed",
        text:
          error.response?.data?.message ||
          "Failed to migrate candidate to employee",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Migrate Candidate to Employee
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Candidate Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Candidate Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {candidate.fullName}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Applied Position:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {candidate.appliedPosition?.replace(/_/g, " ") ||
                    "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Education:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {candidate.education}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Province:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {candidate.province.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Migration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee ID (optional)
                </label>
                <input
                  type="text"
                  value={formData.employeeId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employeeId: e.target.value,
                    }))
                  }
                  placeholder="Leave empty for auto-generation"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Format: [DEPT][YEAR][NUMBER] (e.g., PE240001)
                </p>
              </div>

              {/* Hired Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hired Position *
                </label>
                <select
                  value={formData.hiredPosition}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hiredPosition: e.target.value as Position,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(Position).map((position) => (
                    <option key={position} value={position}>
                      {position.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value as Department,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(Department).map((dept) => (
                    <option key={dept} value={dept}>
                      {RecruitmentFormService.getDepartmentDisplayName(dept)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Probation End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Probation End Date
                </label>
                <input
                  type="date"
                  value={formData.probationEndDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      probationEndDate: e.target.value || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Contract Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Type
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contractType: e.target.value as ContractType,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(ContractType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Basic Salary (IDR)
                </label>
                <input
                  type="number"
                  value={formData.basicSalary || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      basicSalary: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="e.g., 5000000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Work Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Location
                </label>
                <input
                  type="text"
                  value={formData.workLocation || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workLocation: e.target.value,
                    }))
                  }
                  placeholder="e.g., Head Office, Site A"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Shift Pattern */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Shift Pattern
                </label>
                <select
                  value={formData.shiftPattern}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shiftPattern: e.target.value as ShiftPattern,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(ShiftPattern).map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {pattern.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContactName: e.target.value,
                    }))
                  }
                  placeholder="Emergency contact name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContactPhone: e.target.value,
                    }))
                  }
                  placeholder="e.g., +628123456789"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md flex items-center gap-2 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                )}
                {loading ? "Migrating..." : "Migrate to Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};