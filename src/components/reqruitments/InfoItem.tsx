import React from "react";
import { LucideIcon } from "lucide-react";

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
    <Icon className="w-4 h-4 text-gray-400" />
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);
