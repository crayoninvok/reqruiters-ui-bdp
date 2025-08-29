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
      return "bg-amber-900/20 text-amber-300 ring-1 ring-amber-400/30";
    case RecruitmentStatus.ON_PROGRESS:
      return "bg-sky-900/20 text-sky-300 ring-1 ring-sky-400/30";
    case RecruitmentStatus.INTERVIEW:
      return "bg-violet-900/20 text-violet-300 ring-1 ring-violet-400/30";
    case RecruitmentStatus.PSIKOTEST:
      return "bg-fuchsia-900/20 text-fuchsia-300 ring-1 ring-fuchsia-400/30";
    case RecruitmentStatus.USER_INTERVIEW:
      return "bg-indigo-900/20 text-indigo-300 ring-1 ring-indigo-400/30";
    case RecruitmentStatus.MEDICAL_CHECKUP:
      return "bg-teal-900/20 text-teal-300 ring-1 ring-teal-400/30";
    case RecruitmentStatus.MEDICAL_FOLLOWUP:
      return "bg-orange-900/20 text-orange-300 ring-1 ring-orange-400/30";
    case RecruitmentStatus.REJECTED:
      return "bg-red-900/20 text-red-300 ring-1 ring-red-400/30";
    case RecruitmentStatus.HIRED:
      return "bg-green-900/20 text-green-300 ring-1 ring-green-400/30";
    default:
      return "bg-gray-700/20 text-gray-300 ring-1 ring-gray-400/30";
  }
};

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              {stats.totalForms}
            </p>
            <p className="text-sm text-gray-300">
              Total Applications
            </p>
          </div>
          <div className="p-2 bg-blue-900/30 backdrop-blur-sm rounded border border-blue-400/20">
            <svg
              className="w-6 h-6 text-blue-400"
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
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">
                {stat.count}
              </p>
              <p className="text-sm text-gray-300 capitalize">
                {stat.status.replace("_", " ").toLowerCase()}
              </p>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${getStatusColor(
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