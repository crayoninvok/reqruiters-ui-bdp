import React from "react";
import { RecruitmentForm } from "@/types/types";

interface PhysicalInfoSectionProps {
  recruitmentForm: RecruitmentForm;
}

export const PhysicalInfoSection: React.FC<PhysicalInfoSectionProps> = ({
  recruitmentForm,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6 print-section print-physical-info">
      <h2 className="text-lg font-semibold text-white mb-4 print-section-title">
        Physical & Size Information
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print-grid">
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label mb-1">
            Height
          </label>
          <p className="text-white font-medium print-value">
            {recruitmentForm.heightCm} cm
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label mb-1">
            Weight
          </label>
          <p className="text-white font-medium print-value">
            {recruitmentForm.weightKg} kg
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label mb-1">
            Shirt Size
          </label>
          <p className="text-white print-value">{recruitmentForm.shirtSize}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label mb-1">
            Safety Shoes
          </label>
          <p className="text-white print-value">
            {recruitmentForm.safetyShoesSize.replace("SIZE_", "")}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label mb-1">
            Pants Size
          </label>
          <p className="text-white print-value">
            {recruitmentForm.pantsSize.replace("SIZE_", "")}
          </p>
        </div>
      </div>
    </div>
  );
};
