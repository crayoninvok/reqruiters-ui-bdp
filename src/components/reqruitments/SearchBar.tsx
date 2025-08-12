import React from "react";
import { Search, RefreshCw } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  loading,
  onRefresh,
}) => (
  <div className="flex gap-4 mb-6">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search by name, phone number, position..."
        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
    <button
      onClick={onRefresh}
      disabled={loading}
      className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      Refresh
    </button>
  </div>
);