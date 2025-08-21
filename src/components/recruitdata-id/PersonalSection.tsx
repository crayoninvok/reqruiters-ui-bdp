import React from "react";
import { RecruitmentForm } from "@/types/types";

interface PersonalInfoSectionProps {
  recruitmentForm: RecruitmentForm;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  recruitmentForm,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section print-personal-info">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-section-title">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-grid">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Full Name
          </label>
          <p className="text-gray-900 dark:text-white font-medium print-value">
            {recruitmentForm.fullName}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Birth Place & Date
          </label>
          <p className="text-gray-900 dark:text-white print-value">
            {recruitmentForm.birthPlace}, {formatDate(recruitmentForm.birthDate)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Province
          </label>
          <p className="text-gray-900 dark:text-white print-value">
            {recruitmentForm.province.replace(/_/g, " ")}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            WhatsApp Number
          </label>
          <p className="text-gray-900 dark:text-white print-value">
            {recruitmentForm.whatsappNumber}
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Address
          </label>
          <p className="text-gray-900 dark:text-white print-value">
            {recruitmentForm.address}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Marital Status
          </label>
          <p className="text-gray-900 dark:text-white print-value">
            {recruitmentForm.maritalStatus}
          </p>
        </div>
      </div>
    </div>
  );
};