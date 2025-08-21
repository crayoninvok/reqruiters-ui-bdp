import React from "react";
import Link from "next/link";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";

interface RecruitmentTableProps {
  recruitmentForms: RecruitmentForm[];
  loading: boolean;
  onStatusUpdate: (id: string, newStatus: RecruitmentStatus, candidateName: string) => void;
  onMigrate: (candidate: RecruitmentForm) => void;
  onDelete: (id: string, name: string) => void;
  onDeleteMigrated: (form: RecruitmentForm) => void;
}

const getStatusColor = (status: RecruitmentStatus) => {
  switch (status) {
    case RecruitmentStatus.PENDING:
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
    case RecruitmentStatus.ON_PROGRESS:
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20";
    case RecruitmentStatus.INTERVIEW:
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-600/20";
    case RecruitmentStatus.PSIKOTEST:
      return "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-600/20";
    case RecruitmentStatus.USER_INTERVIEW:
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20";
    case RecruitmentStatus.MEDICAL_CHECKUP:
      return "bg-teal-50 text-teal-700 ring-1 ring-teal-600/20";
    case RecruitmentStatus.MEDICAL_FOLLOWUP:
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20";
    case RecruitmentStatus.REJECTED:
      return "bg-red-50 text-red-700 ring-1 ring-red-600/20";
    case RecruitmentStatus.HIRED:
      return "bg-green-50 text-green-700 ring-1 ring-green-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
  }
};

export const RecruitmentTable: React.FC<RecruitmentTableProps> = ({
  recruitmentForms,
  loading,
  onStatusUpdate,
  onMigrate,
  onDelete,
  onDeleteMigrated,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Education
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Province
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Certificates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </td>
              </tr>
            ) : recruitmentForms.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No recruitment data found
                </td>
              </tr>
            ) : (
              recruitmentForms.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {form.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {form.hiredEmployee ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            ID: {form.hiredEmployee.employeeId}
                          </span>
                        ) : (
                          form.whatsappNumber
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {form.appliedPosition?.replace(/_/g, " ") ||
                      "Not specified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {form.education}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {form.province.replace(/_/g, " ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {form.certificate && form.certificate.length > 0 ? (
                        form.certificate.slice(0, 2).map((cert, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {cert.replace(/_/g, " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          No certificates
                        </span>
                      )}
                      {form.certificate && form.certificate.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                          +{form.certificate.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        onStatusUpdate(
                          form.id,
                          e.target.value as RecruitmentStatus,
                          form.fullName
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                        form.status
                      )}`}
                    >
                      {Object.values(RecruitmentStatus).map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {/* View Details */}
                      <Link
                        href={`/dashboard/recruitdata/${form.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>

                      {/* Migrate to Employee - only show if HIRED status and not already migrated */}
                      {form.status === RecruitmentStatus.HIRED &&
                        !form.hiredEmployee && (
                          <button
                            onClick={() => onMigrate(form)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Migrate to Employee"
                          >
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
                          </button>
                        )}

                      {/* Delete - different behavior for migrated vs non-migrated */}
                      {form.hiredEmployee ? (
                        <button
                          onClick={() => onDeleteMigrated(form)}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          title="Delete recruitment form (employee record will remain)"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => onDelete(form.id, form.fullName)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete recruitment form"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};