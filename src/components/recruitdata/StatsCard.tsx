import React from "react";
import { RecruitmentStatus } from "@/types/types";

interface StatsData {
  totalForms: number;
  statusBreakdown: Array<{
    status: RecruitmentStatus;
    count: number;
  }>;
}

interface StatsCardsProps {
  stats: StatsData | null;
}

const getStatusColor = (status: RecruitmentStatus) => {
  switch (status) {
    case RecruitmentStatus.PENDING:
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
    case RecruitmentStatus.ON_PROGRESS:
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20";
    case RecruitmentStatus.INTERVIEW:
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-600/20";
    case RecruitmentStatus.PSIKOTEST:
      return "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-600/20";
    case RecruitmentStatus.USER_INTERVIEW:
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20";
    case RecruitmentStatus.MEDICAL_CHECKUP:
      return "bg-teal-50 text-teal-700 ring-1 ring-teal-600/20";
    case RecruitmentStatus.MEDICAL_FOLLOWUP:
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20";
    case RecruitmentStatus.REJECTED:
      return "bg-red-50 text-red-700 ring-1 ring-red-600/20";
    case RecruitmentStatus.HIRED:
      return "bg-green-50 text-green-700 ring-1 ring-green-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
  }
};

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalForms}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Applications
            </p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {stats.statusBreakdown.map((stat) => (
        <div
          key={stat.status}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.count}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {stat.status.replace("_", " ").toLowerCase()}
              </p>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                stat.status
              )}`}
            >
              {stat.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};