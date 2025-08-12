import React from "react";
import { Clock, Play, CheckCircle, AlertCircle } from "lucide-react";
import { formatters } from "@/utils/formatter";

interface StatusBadgeProps {
  status: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'subtle';
  showIcon?: boolean;
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    colors: {
      default: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30",
      outline: "border-2 border-amber-300 text-amber-700 bg-white dark:border-amber-600 dark:text-amber-400 dark:bg-gray-800",
      subtle: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
    }
  },
  ON_PROGRESS: {
    icon: Play,
    colors: {
      default: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30",
      outline: "border-2 border-blue-300 text-blue-700 bg-white dark:border-blue-600 dark:text-blue-400 dark:bg-gray-800",
      subtle: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
    }
  },
  COMPLETED: {
    icon: CheckCircle,
    colors: {
      default: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30",
      outline: "border-2 border-emerald-300 text-emerald-700 bg-white dark:border-emerald-600 dark:text-emerald-400 dark:bg-gray-800",
      subtle: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
    }
  },
  default: {
    icon: AlertCircle,
    colors: {
      default: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700",
      outline: "border-2 border-gray-300 text-gray-700 bg-white dark:border-gray-600 dark:text-gray-400 dark:bg-gray-800",
      subtle: "bg-gray-50 text-gray-700 dark:bg-gray-950/50 dark:text-gray-400"
    }
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  variant = 'default',
  showIcon = true
}) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };
  
  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full border transition-all duration-200
      ${sizeClasses[size]} 
      ${config.colors[variant]}
    `}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {formatters.formatStatus(status)}
    </span>
  );
};