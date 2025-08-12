import React from "react";
import { Users, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  loading: boolean;
  hasApplications: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  loading,
  hasApplications,
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">
          Loading applications...
        </p>
      </div>
    );
  }

  if (!hasApplications) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
          No applications found
        </p>
        <p className="text-gray-400 dark:text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return null;
};