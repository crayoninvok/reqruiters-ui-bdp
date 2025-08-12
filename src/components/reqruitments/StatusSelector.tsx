import React from "react";
import { RecruitmentStatus } from "@/types/types";

interface StatusSelectorProps {
  currentStatus: string | null | undefined;
  onStatusChange: (status: string) => void;
  size?: 'sm' | 'md';
}

const statusOptions = [
  { value: RecruitmentStatus.PENDING, label: "Pending" },
  { value: RecruitmentStatus.ON_PROGRESS, label: "On Progress" },
  { value: RecruitmentStatus.COMPLETED, label: "Completed" }
];

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  size = 'sm'
}) => {
  const sizeClass = size === 'md' ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs';

  return (
    <select
      value={currentStatus || RecruitmentStatus.PENDING}
      onChange={(e) => onStatusChange(e.target.value)}
      className={`${sizeClass} bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
    >
      {statusOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};