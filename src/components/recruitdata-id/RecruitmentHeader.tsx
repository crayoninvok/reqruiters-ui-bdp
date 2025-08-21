import React from "react";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";

interface RecruitmentHeaderProps {
  recruitmentForm: RecruitmentForm;
  onStatusUpdate: (status: RecruitmentStatus) => void;
  router: any;
}

export const RecruitmentHeader: React.FC<RecruitmentHeaderProps> = ({
  recruitmentForm,
  onStatusUpdate,
  router,
}) => {
  const getStatusColor = (status: RecruitmentStatus) => {
    switch (status) {
      case RecruitmentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case RecruitmentStatus.ON_PROGRESS:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case RecruitmentStatus.HIRED:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print-header">
      {/* Company Logo - Print Only */}
      <img
        src="/logohr.svg"
        alt="Company Logo"
        className="print-company-logo hidden print:block"
      />

      <div className="print-header-content">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2 no-print"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to List
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {recruitmentForm.fullName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Application submitted on {formatDate(recruitmentForm.createdAt)}
        </p>
        {/* Status for print */}
        <div className="hidden print:block print-status">
          Status: {recruitmentForm.status.replace("_", " ")}
        </div>
      </div>

      {/* Photo in print mode */}
      {recruitmentForm.documentPhotoUrl && (
        <div className="hidden print:block print-photo-container">
          <img
            src={recruitmentForm.documentPhotoUrl}
            alt={`${recruitmentForm.fullName}'s photo`}
            className="print-photo"
          />
        </div>
      )}

      <div className="flex items-center space-x-3 no-print">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            recruitmentForm.status
          )}`}
        >
          {recruitmentForm.status.replace("_", " ")}
        </span>
        <select
          value={recruitmentForm.status}
          onChange={(e) =>
            onStatusUpdate(e.target.value as RecruitmentStatus)
          }
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(RecruitmentStatus).map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};