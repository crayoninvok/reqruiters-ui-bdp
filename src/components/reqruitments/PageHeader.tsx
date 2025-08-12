import React from "react";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  onNewApplication?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onNewApplication }) => (
  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-8">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recruitment Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage job applications and candidate information
          </p>
        </div>
        <button 
          onClick={onNewApplication}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>
    </div>
  </div>
);