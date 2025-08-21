import React from "react";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";

interface SidebarSectionProps {
  recruitmentForm: RecruitmentForm;
  onPhotoClick: () => void;
  onViewDocument: (url: string, name: string, type: "image" | "pdf") => void;
  onDownloadDocument: (url: string, filename: string) => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  getFileType: (url: string) => "image" | "pdf";
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  recruitmentForm,
  onPhotoClick,
  onViewDocument,
  onDownloadDocument,
  onPrint,
  onDownloadPDF,
  getFileType,
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
    <div className="space-y-6 no-print">
      {/* Candidate Photo */}
      {recruitmentForm.documentPhotoUrl && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Candidate Photo
          </h3>
          <div className="flex justify-center">
            <div
              className="w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onPhotoClick}
            >
              <img
                src={recruitmentForm.documentPhotoUrl}
                alt={`${recruitmentForm.fullName}'s photo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-avatar.jpg";
                }}
              />
            </div>
          </div>
          <div className="mt-4 text-center space-y-2">
            <button
              onClick={onPhotoClick}
              className="block w-full text-blue-600 hover:text-blue-800 text-sm underline"
            >
              View Full Size
            </button>
            <button
              onClick={() =>
                onDownloadDocument(
                  recruitmentForm.documentPhotoUrl!,
                  `${recruitmentForm.fullName}-photo.jpg`
                )
              }
              className="block w-full text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Download Photo
            </button>
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Info
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Status:</span>
            <span
              className={`px-2 py-1 rounded text-xs ${getStatusColor(
                recruitmentForm.status
              )}`}
            >
              {recruitmentForm.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Marital Status:
            </span>
            <span className="text-gray-900 dark:text-white">
              {recruitmentForm.maritalStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Applied:</span>
            <span className="text-gray-900 dark:text-white">
              {formatDate(recruitmentForm.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Updated:</span>
            <span className="text-gray-900 dark:text-white">
              {formatDate(recruitmentForm.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Documents
        </h3>
        <div className="space-y-3">
          {recruitmentForm.documentCvUrl && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                CV
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    onViewDocument(
                      recruitmentForm.documentCvUrl!,
                      "CV",
                      getFileType(recruitmentForm.documentCvUrl!)
                    )
                  }
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    onDownloadDocument(recruitmentForm.documentCvUrl!, "cv.pdf")
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          )}
          {recruitmentForm.documentKtpUrl && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                KTP
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    onViewDocument(
                      recruitmentForm.documentKtpUrl!,
                      "KTP",
                      getFileType(recruitmentForm.documentKtpUrl!)
                    )
                  }
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    onDownloadDocument(recruitmentForm.documentKtpUrl!, "ktp.jpg")
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          )}
          {recruitmentForm.documentSkckUrl && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                SKCK
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    onViewDocument(
                      recruitmentForm.documentSkckUrl!,
                      "SKCK",
                      getFileType(recruitmentForm.documentSkckUrl!)
                    )
                  }
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    onDownloadDocument(
                      recruitmentForm.documentSkckUrl!,
                      "skck.pdf"
                    )
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          )}
          {recruitmentForm.documentVaccineUrl && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Vaccine Certificate
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    onViewDocument(
                      recruitmentForm.documentVaccineUrl!,
                      "Vaccine Certificate",
                      getFileType(recruitmentForm.documentVaccineUrl!)
                    )
                  }
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    onDownloadDocument(
                      recruitmentForm.documentVaccineUrl!,
                      "vaccine.pdf"
                    )
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          )}
          {recruitmentForm.supportingDocsUrl && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Supporting Docs
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    onViewDocument(
                      recruitmentForm.supportingDocsUrl!,
                      "Supporting Documents",
                      getFileType(recruitmentForm.supportingDocsUrl!)
                    )
                  }
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    onDownloadDocument(
                      recruitmentForm.supportingDocsUrl!,
                      "supporting.pdf"
                    )
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions
        </h3>
        <div className="space-y-3">
          <button
            onClick={onPrint}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
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
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
            Print Details
          </button>
          <button
            onClick={onDownloadPDF}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};