import React from "react";
import { User, Briefcase, Contact, Users } from "lucide-react";

interface EmployeeTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const EmployeeTabs: React.FC<EmployeeTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "hierarchy", label: "Hierarchy", icon: Users },
  ];

  return (
    <div className="mb-6">
      <div className="flex space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};