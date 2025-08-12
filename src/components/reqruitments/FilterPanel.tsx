import React from "react";
import { Filter } from "lucide-react";
import { ExtendedRecruitmentFormFilters } from "@/types/recruitment.types";

interface FilterPanelProps {
  filters: ExtendedRecruitmentFormFilters;
  onChange: (key: keyof ExtendedRecruitmentFormFilters, value: any) => void;
  show: boolean;
  onToggle: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  show,
  onToggle,
}) => (
  <div className="mb-6">
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg mb-4 font-medium ${
        show
          ? "bg-blue-600 text-white"
          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
      }`}
    >
      <Filter className="w-4 h-4" />
      Filters
    </button>

    {show && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <select
          value={filters.status || "all"}
          onChange={(e) => onChange("status", e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ON_PROGRESS">On Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={filters.appliedPosition || "all"}
          onChange={(e) => onChange("appliedPosition", e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
        >
          <option value="all">All Positions</option>
          <option value="PROD_ENG_SPV">
            Production Engineering Supervisor
          </option>
          <option value="PRODUCTION_GROUP_LEADER">
            Production Group Leader
          </option>
          <option value="MOCO_LEADER">MOCO Leader</option>
          <option value="CCR_ADMIN">CCR Admin</option>
          <option value="DRIVER_DT">Driver DT</option>
          <option value="MECHANIC_JR">Mechanic Junior</option>
          <option value="MECHANIC_SR">Mechanic Senior</option>
          <option value="WELDER">Welder</option>
          <option value="ELECTRICIAN">Electrician</option>
          <option value="SAFETY_OFFICER">Safety Officer</option>
          <option value="HSE_SPV">HSE Supervisor</option>
          <option value="IT_SUPPORT">IT Support</option>
        </select>

        <select
          value={filters.education || "all"}
          onChange={(e) => onChange("education", e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
        >
          <option value="all">All Education</option>
          <option value="SD">SD</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
          <option value="SMK">SMK</option>
          <option value="D3">D3</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
          <option value="S3">S3</option>
        </select>
      </div>
    )}
  </div>
);