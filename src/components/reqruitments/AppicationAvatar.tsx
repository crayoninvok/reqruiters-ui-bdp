import React from "react";
import { formatters } from "@/utils/formatter";

interface ApplicationAvatarProps {
  photoUrl?: string | null;
  fullName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  status?: string | null;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm", 
  lg: "w-16 h-16 text-base",
  xl: "w-20 h-20 text-lg"
};

const statusIndicatorColors = {
  PENDING: "bg-yellow-400 border-yellow-200",
  ON_PROGRESS: "bg-blue-400 border-blue-200", 
  COMPLETED: "bg-green-400 border-green-200",
  default: "bg-gray-400 border-gray-200"
};

export const ApplicationAvatar: React.FC<ApplicationAvatarProps> = ({
  photoUrl,
  fullName,
  size = 'md',
  showBorder = false,
  status
}) => {
  const borderClass = showBorder ? "ring-2 ring-white ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800" : "";
  const statusColor = status ? statusIndicatorColors[status as keyof typeof statusIndicatorColors] || statusIndicatorColors.default : statusIndicatorColors.default;

  if (photoUrl) {
    return (
      <div className="relative">
        <img
          src={photoUrl}
          alt={fullName}
          className={`${sizeClasses[size]} ${borderClass} rounded-xl object-cover shadow-sm`}
        />
        {status && (
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} rounded-full border-2 border-white dark:border-gray-800`} />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} ${borderClass} bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm`}>
        {formatters.getInitials(fullName)}
      </div>
      {status && (
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} rounded-full border-2 border-white dark:border-gray-800`} />
      )}
    </div>
  );
};