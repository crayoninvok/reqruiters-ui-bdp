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
        return "bg-yellow-900/30 text-yellow-300 border-yellow-400/20";
      case RecruitmentStatus.ON_PROGRESS:
        return "bg-blue-900/30 text-blue-300 border-blue-400/20";
      case RecruitmentStatus.HIRED:
        return "bg-green-900/30 text-green-300 border-green-400/20";
      default:
        return "bg-gray-700/50 text-gray-300 border-gray-600/30";
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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6 print-header">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Company Logo - Print Only */}
        <img
          src="/logohr.svg"
          alt="Company Logo"
          className="print-company-logo hidden print:block"
        />

        <div className="print-header-content flex-1">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 no-print transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
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
          <h1 className="text-2xl font-bold text-white mb-2">
            {recruitmentForm.fullName}
          </h1>
          <p className="text-gray-300 mb-1">
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
            className={`px-3 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${getStatusColor(
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
            className="px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm transition-colors"
          >
            {Object.values(RecruitmentStatus).map((status) => (
              <option
                key={status}
                value={status}
                className="bg-gray-800 text-white"
              >
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
