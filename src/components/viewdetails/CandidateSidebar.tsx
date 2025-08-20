import React from 'react';
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";

interface CandidateSidebarProps {
  recruitmentForm: RecruitmentForm;
  getStatusColor: (status: RecruitmentStatus) => string;
  formatDate: (dateString: string) => string;
  onPhotoClick: () => void;
  onViewDocument: (url: string, name: string, type: "image" | "pdf") => void;
  onDownloadDocument: (url: string, filename: string) => void;
  getFileType: (url: string) => "image" | "pdf";
  onPrint: () => void;
  onDownloadPDF: () => void;
}

const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  recruitmentForm,
  getStatusColor,
  formatDate,
  onPhotoClick,
  onViewDocument,
  onDownloadDocument,
  getFileType,
  onPrint,
  onDownloadPDF,
}) => {
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
              className="w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity shadow-md"
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
              className="block w-full text-blue-600 hover:text-blue-800 text-sm underline font-medium transition-colors"
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
              className="block w-full text-blue-600 hover:text-blue-800 text-sm underline font-medium transition-colors"
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
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(recruitmentForm.status)}`}>
              {recruitmentForm.status.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Marital Status:</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">
              {recruitmentForm.maritalStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Applied:</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">
              {formatDate(recruitmentForm.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Updated:</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">
              {formatDate(recruitmentForm.updatedAt)}
            </span>
          </div>
          {recruitmentForm.appliedPosition && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Position:</span>
              <span className="text-gray-900 dark:text-white text-sm font-medium">
                {recruitmentForm.appliedPosition.replace(/_/g, " ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Documents
        </h3>
        <div className="space-y-3">
          {recruitmentForm.documentCvUrl && (
            <DocumentItem
              label="CV"
              url={recruitmentForm.documentCvUrl}
              filename="cv.pdf"
              onView={onViewDocument}
              onDownload={onDownloadDocument}
              getFileType={getFileType}
            />
          )}
          {recruitmentForm.documentKtpUrl && (
            <DocumentItem
              label="KTP"
              url={recruitmentForm.documentKtpUrl}
              filename="ktp.jpg"
              onView={onViewDocument}
              onDownload={onDownloadDocument}
              getFileType={getFileType}
            />
          )}
          {recruitmentForm.documentSkckUrl && (
            <DocumentItem
              label="SKCK"
              url={recruitmentForm.documentSkckUrl}
              filename="skck.pdf"
              onView={onViewDocument}
              onDownload={onDownloadDocument}
              getFileType={getFileType}
            />
          )}
          {recruitmentForm.documentVaccineUrl && (
            <DocumentItem
              label="Vaccine Certificate"
              url={recruitmentForm.documentVaccineUrl}
              filename="vaccine.pdf"
              onView={onViewDocument}
              onDownload={onDownloadDocument}
              getFileType={getFileType}
            />
          )}
          {recruitmentForm.supportingDocsUrl && (
            <DocumentItem
              label="Supporting Docs"
              url={recruitmentForm.supportingDocsUrl}
              filename="supporting.pdf"
              onView={onViewDocument}
              onDownload={onDownloadDocument}
              getFileType={getFileType}
            />
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
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Print Details
          </button>
          <button
            onClick={onDownloadPDF}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// Document item sub-component
interface DocumentItemProps {
  label: string;
  url: string;
  filename: string;
  onView: (url: string, name: string, type: "image" | "pdf") => void;
  onDownload: (url: string, filename: string) => void;
  getFileType: (url: string) => "image" | "pdf";
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  label,
  url,
  filename,
  onView,
  onDownload,
  getFileType,
}) => {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
        {label}
      </span>
      <div className="flex space-x-2">
        <button
          onClick={() => onView(url, label, getFileType(url))}
          className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
        >
          View
        </button>
        <span className="text-gray-400">|</span>
        <button
          onClick={() => onDownload(url, filename)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default CandidateSidebar;