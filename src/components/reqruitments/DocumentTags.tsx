import React from "react";
import { RecruitmentForm } from "@/types/types";

interface DocumentTagsProps {
  application: RecruitmentForm;
}

interface DocumentItem {
  url: string | null | undefined;
  label: string;
}

export const DocumentTags: React.FC<DocumentTagsProps> = ({ application }) => {
  const documents: DocumentItem[] = [
    { url: application.documentPhotoUrl, label: "Photo" },
    { url: application.documentCvUrl, label: "CV" },
    { url: application.documentKtpUrl, label: "KTP" },
    { url: application.documentSkckUrl, label: "SKCK" },
    { url: application.documentVaccineUrl, label: "Vaccine" },
    { url: application.supportingDocsUrl, label: "Others" }
  ];

  const availableDocuments = documents.filter(doc => doc.url);

  if (availableDocuments.length === 0) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        No documents uploaded
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Documents:
      </div>
      <div className="flex flex-wrap gap-2">
        {availableDocuments.map(({ label }) => (
          <span 
            key={label}
            className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};