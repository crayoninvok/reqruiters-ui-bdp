import React from "react";
import { RecruitmentForm } from "@/types/types";

interface CertificatesSectionProps {
  recruitmentForm: RecruitmentForm;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  recruitmentForm,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section print-certificates-section">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-section-title">
        Certificates
      </h2>
      <div className="flex flex-wrap gap-2 print-certificates">
        {recruitmentForm.certificate.map((cert, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full print-cert-item"
          >
            {cert.replace(/_/g, " ")}
          </span>
        ))}
      </div>
    </div>
  );
};