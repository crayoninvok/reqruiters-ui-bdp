import React from "react";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  variant?: 'default' | 'compact' | 'highlighted';
  color?: 'blue' | 'green' | 'purple' | 'gray';
}

const colorClasses = {
  blue: {
    icon: "text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    bg: "bg-blue-50/50 dark:bg-blue-900/10"
  },
  green: {
    icon: "text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    bg: "bg-green-50/50 dark:bg-green-900/10"
  },
  purple: {
    icon: "text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
    bg: "bg-purple-50/50 dark:bg-purple-900/10"
  },
  gray: {
    icon: "text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400",
    bg: "bg-gray-50/50 dark:bg-gray-800/50"
  }
};

export const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  variant = 'default',
  color = 'gray'
}) => {
  const colors = colorClasses[color];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className={`p-1.5 rounded-lg ${colors.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {value}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'highlighted') {
    return (
      <div className={`p-4 rounded-xl border ${colors.bg} border-gray-200/50 dark:border-gray-700/50`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg ${colors.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </div>
        </div>
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`p-2 rounded-lg ${colors.icon}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}:
        </span>
        <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
          {value}
        </span>
      </div>
    </div>
  );
};