import React from "react";
import Link from "next/link";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";
import { formatDateID, formatDateMediumID } from "@/utils/formatDate";

interface RecruitmentTableProps {
  recruitmentForms: RecruitmentForm[];
  onStatusUpdate: (
    id: string,
    newStatus: RecruitmentStatus,
    candidateName: string
  ) => void;
  onMigrate: (candidate: RecruitmentForm) => void;
  onDelete: (id: string, name: string) => void;
  onDeleteMigrated: (form: RecruitmentForm) => void;
  userRole?: string;
  selectedIds?: string[];
  onSelectChange?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

const getStatusColor = (status: RecruitmentStatus) => {
  switch (status) {
    case RecruitmentStatus.PENDING:
      return "bg-amber-900/20 text-amber-300 ring-1 ring-amber-400/30";
    case RecruitmentStatus.ON_PROGRESS:
      return "bg-sky-900/20 text-sky-300 ring-1 ring-sky-400/30";
    case RecruitmentStatus.INTERVIEW:
      return "bg-violet-900/20 text-violet-300 ring-1 ring-violet-400/30";
    case RecruitmentStatus.PSIKOTEST:
      return "bg-fuchsia-900/20 text-fuchsia-300 ring-1 ring-fuchsia-400/30";
    case RecruitmentStatus.USER_INTERVIEW:
      return "bg-indigo-900/20 text-indigo-300 ring-1 ring-indigo-400/30";
    case RecruitmentStatus.MEDICAL_CHECKUP:
      return "bg-teal-900/20 text-teal-300 ring-1 ring-teal-400/30";
    case RecruitmentStatus.MEDICAL_FOLLOWUP:
      return "bg-orange-900/20 text-orange-300 ring-1 ring-orange-400/30";
    case RecruitmentStatus.REJECTED:
      return "bg-red-900/20 text-red-300 ring-1 ring-red-400/30";
    case RecruitmentStatus.HIRED:
      return "bg-green-900/20 text-green-300 ring-1 ring-green-400/30";
    default:
      return "bg-gray-700/20 text-gray-300 ring-1 ring-gray-400/30";
  }
};

export const RecruitmentTable: React.FC<RecruitmentTableProps> = ({
  recruitmentForms,
  onStatusUpdate,
  onMigrate,
  onDelete,
  onDeleteMigrated,
  userRole,
  selectedIds = [],
  onSelectChange,
  onSelectAll,
}) => {
  const isViewOnly = userRole === "VIEWS_ONLY";
  const canSelect = !isViewOnly && onSelectChange && onSelectAll;
  const allSelected = canSelect && recruitmentForms.length > 0 && recruitmentForms.every(form => selectedIds.includes(form.id));
  const someSelected = canSelect && recruitmentForms.some(form => selectedIds.includes(form.id));

  return (
    <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 border border-slate-600/30 rounded-xl sm:rounded-2xl shadow-xl relative">
      {/* Desktop view with sticky columns */}
      <div className="hidden lg:block overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-600/30">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              {canSelect && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-700 z-20 min-w-[50px]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = !!(someSelected && !allSelected);
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
              )}
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider sticky ${canSelect ? 'left-[50px]' : 'left-0'} bg-gray-700 z-20 min-w-[200px] ${canSelect ? 'border-l border-gray-600/30' : ''}`}>
                Kandidat
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider sticky ${canSelect ? 'left-[250px]' : 'left-[200px]'} bg-gray-700 z-20 min-w-[150px] border-l border-gray-600/30`}>
                Posisi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Jenis Kelamin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Pendidikan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Provinsi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[200px]">
                Sertifikat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[150px]">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Aksi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Tanggal Diterima
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Diupdate Oleh
              </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Pernah di Tambang
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-600/20">
            {recruitmentForms.length === 0 ? (
              <tr>
                <td colSpan={canSelect ? 12 : 11} className="px-6 py-4 text-center text-gray-400">
                  Tidak ada data rekrutmen ditemukan
                </td>
              </tr>
            ) : (
              recruitmentForms.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  {canSelect && (
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-gray-800 z-10 min-w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(form.id)}
                        onChange={(e) => onSelectChange?.(form.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                  )}
                  <td className={`px-6 py-4 whitespace-nowrap sticky ${canSelect ? 'left-[50px]' : 'left-0'} bg-gray-800 z-10 min-w-[200px] ${canSelect ? 'border-l border-gray-600/30' : ''}`}>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {form.fullName}
                      </div>
                      <div className="text-sm text-gray-300">
                        {form.hiredEmployee ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded backdrop-blur-sm border border-green-400/20">
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
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-white sticky ${canSelect ? 'left-[250px]' : 'left-[200px]'} bg-gray-800 z-10 min-w-[150px] border-l border-gray-600/30`}>
                    {form.appliedPosition?.replace(/_/g, " ") ||
                      "Tidak ditentukan"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white min-w-[120px]">
                    {form.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white min-w-[120px]">
                    {form.education}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white min-w-[120px]">
                    {form.province.replace(/_/g, " ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {form.certificate && form.certificate.length > 0 ? (
                        form.certificate.slice(0, 2).map((cert, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 backdrop-blur-sm border border-blue-400/20"
                          >
                            {cert.replace(/_/g, " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">
                          Tidak ada sertifikat
                        </span>
                      )}
                      {form.certificate && form.certificate.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600/30 text-gray-200 backdrop-blur-sm border border-gray-400/20">
                          +{form.certificate.length - 2} lagi
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap min-w-[150px]">
                    {isViewOnly ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 backdrop-blur-sm inline-block ${getStatusColor(
                          form.status
                        )}`}
                      >
                        {form.status.replace(/_/g, " ")}
                      </span>
                    ) : (
                      <select
                        value={form.status}
                        onChange={(e) =>
                          onStatusUpdate(
                            form.id,
                            e.target.value as RecruitmentStatus,
                            form.fullName
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-400 backdrop-blur-sm ${getStatusColor(
                          form.status
                        )}`}
                        style={{ backgroundColor: "transparent" }}
                      >
                        {Object.values(RecruitmentStatus).map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-gray-800 text-white"
                          >
                            {status.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium min-w-[120px]">
                    <div className="flex items-center space-x-2">
                      {/* View Details - Same Tab */}
                      <Link
                        href={`/dashboard/recruitdata/${form.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Lihat Detail"
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

                      {/* View Details - New Tab */}
                      <Link
                        href={`/dashboard/recruitdata/${form.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka di Tab Baru"
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>

                      {/* Migrate to Employee - only show if HIRED status and not already migrated, and not VIEWS_ONLY */}
                      {!isViewOnly &&
                        form.status === RecruitmentStatus.HIRED &&
                        !form.hiredEmployee && (
                          <button
                            onClick={() => onMigrate(form)}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Migrasikan ke Karyawan"
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

                      {/* Delete - hide for VIEWS_ONLY */}
                      {!isViewOnly && (
                        <>
                          {form.hiredEmployee ? (
                            <button
                              onClick={() => onDeleteMigrated(form)}
                              className="text-orange-400 hover:text-orange-300 transition-colors"
                              title="Hapus form rekrutmen (catatan karyawan akan tetap utuh)"
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
                                  d="M19 7l-.867 12.142A2 2 0 0016.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => onDelete(form.id, form.fullName)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Hapus form rekrutmen"
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
                                  d="M19 7l-.867 12.142A2 2 0 0016.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white min-w-[120px]">
                    {formatDateID(form.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white min-w-[120px]">
                    {form.statusUpdatedBy?.name || "N/A"}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-white min-w-[120px]">
                    {form.pernahKerjaDiTambang || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view - normal scrolling without sticky columns */}
      <div className="lg:hidden overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-600/30">
          <thead className="bg-gray-700/30 backdrop-blur-sm">
            <tr>
              {canSelect && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[50px]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = !!(someSelected && !allSelected);
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[160px]">
                Kandidat
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Posisi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">
                Pendidikan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">
                Provinsi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[160px]">
                Sertifikat
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">
                Aksi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">
                Tanggal Diterima
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-600/20">
            {recruitmentForms.length === 0 ? (
              <tr>
                <td colSpan={canSelect ? 12 : 11} className="px-4 py-4 text-center text-gray-400">
                  Tidak ada data rekrutmen ditemukan
                </td>
              </tr>
            ) : (
              recruitmentForms.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-gray-700/20 backdrop-blur-sm transition-colors"
                >
                  {canSelect && (
                    <td className="px-4 py-4 whitespace-nowrap min-w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(form.id)}
                        onChange={(e) => onSelectChange?.(form.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap min-w-[160px]">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {form.fullName}
                      </div>
                      <div className="text-sm text-gray-300">
                        {form.hiredEmployee ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded backdrop-blur-sm border border-green-400/20">
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white min-w-[120px]">
                    {form.appliedPosition?.replace(/_/g, " ") ||
                      "Tidak ditentukan"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white min-w-[100px]">
                    {form.education}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white min-w-[100px]">
                    {form.province.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap min-w-[160px]">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {form.certificate && form.certificate.length > 0 ? (
                        form.certificate.slice(0, 2).map((cert, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 backdrop-blur-sm border border-blue-400/20"
                          >
                            {cert.replace(/_/g, " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">
                          Tidak ada sertifikat
                        </span>
                      )}
                      {form.certificate && form.certificate.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600/30 text-gray-200 backdrop-blur-sm border border-gray-400/20">
                          +{form.certificate.length - 2} lagi
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap min-w-[120px]">
                    {isViewOnly ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 backdrop-blur-sm inline-block ${getStatusColor(
                          form.status
                        )}`}
                      >
                        {form.status.replace(/_/g, " ")}
                      </span>
                    ) : (
                      <select
                        value={form.status}
                        onChange={(e) =>
                          onStatusUpdate(
                            form.id,
                            e.target.value as RecruitmentStatus,
                            form.fullName
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-400 backdrop-blur-sm ${getStatusColor(
                          form.status
                        )}`}
                        style={{ backgroundColor: "transparent" }}
                      >
                        {Object.values(RecruitmentStatus).map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-gray-800 text-white"
                          >
                            {status.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium min-w-[100px]">
                    <div className="flex items-center space-x-2">
                      {/* View Details - Same Tab */}
                      <Link
                        href={`/dashboard/recruitdata/${form.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Lihat Detail"
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

                      {/* View Details - New Tab */}
                      <Link
                        href={`/dashboard/recruitdata/${form.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka di Tab Baru"
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>

                      {/* Migrate to Employee - only show if HIRED status and not already migrated, and not VIEWS_ONLY */}
                      {!isViewOnly &&
                        form.status === RecruitmentStatus.HIRED &&
                        !form.hiredEmployee && (
                          <button
                            onClick={() => onMigrate(form)}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Migrasikan ke Karyawan"
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

                      {/* Delete - hide for VIEWS_ONLY */}
                      {!isViewOnly && (
                        <>
                          {form.hiredEmployee ? (
                            <button
                              onClick={() => onDeleteMigrated(form)}
                              className="text-orange-400 hover:text-orange-300 transition-colors"
                              title="Hapus form rekrutmen (catatan karyawan akan tetap utuh)"
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
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Hapus form rekrutmen"
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
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white min-w-[120px]">
                    {formatDateID(form.createdAt)}
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
