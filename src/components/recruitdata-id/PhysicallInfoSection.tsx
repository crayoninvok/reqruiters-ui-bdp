import React from "react";
import { RecruitmentForm } from "@/types/types";

interface PhysicalInfoSectionProps {
  recruitmentForm: RecruitmentForm;
}

export const PhysicalInfoSection: React.FC<PhysicalInfoSectionProps> = ({
  recruitmentForm,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section print-physical-info">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-section-title">
        Physical & Size Information
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print-grid">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Height
          </label>
          <p className="text-gray-900 dark:text-white font-medium print-value">
            {recruitmentForm.heightCm} cm
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Weight
          </label>
          <p className="text-gray-900 dark:text-white font-medium print-value">
            {recruitmentForm.weightKg} kg
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Shirt Size
          </label>
          <p className="text-gray-900 dark:text-white print-value">
            {recruitmentForm.shirtSize}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Safety Shoes
          </label>
          <p className="text-gray-900 dark:text-white print-value">
            {recruitmentForm.safetyShoesSize.replace("SIZE_", "")}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
            Pants Size
          </label>
          <p className="text-gray-900 dark:text-white print-value">
            {recruitmentForm.pantsSize.replace("SIZE_", "")}
          </p>
        </div>
      </div>
    </div>
  );
};