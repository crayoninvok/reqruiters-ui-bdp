import React from "react";
import { RecruitmentForm } from "@/types/types";
import { formatters } from "@/utils/formatter";

interface ApplicationDetailsProps {
  application: RecruitmentForm;
}

interface DetailItem {
  label: string;
  value: string;
  show?: boolean;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
}) => {
  const details: DetailItem[] = [
    {
      label: "Birth Place",
      value: application.birthPlace || "N/A",
    },
    {
      label: "School",
      value: application.schoolName || "N/A",
    },
    {
      label: "Marital Status",
      value: formatters.formatMaritalStatus(application.maritalStatus),
    },
    {
      label: "Work Experience",
      value: application.workExperience || "No experience provided",
      show: !!application.workExperience,
    },
    {
      label: "Experience Level",
      value: formatters.formatExperienceLevel(application.experienceLevel),
    },
    {
      label: "Height/Weight",
      value: `${application.heightCm || 0}cm / ${application.weightKg || 0}kg`,
    },
  ];

  const visibleDetails = details.filter((detail) => detail.show !== false);

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="text-sm space-y-1">
        {visibleDetails.map(({ label, value }) => (
          <div key={label} className="flex flex-col sm:flex-row sm:gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-0 flex-shrink-0">
              {label}:
            </span>
            <span className="text-gray-600 dark:text-gray-400 break-words">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
