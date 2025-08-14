// components/StatCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, gradient }) => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group hover:shadow-xl transition-all duration-300">
    <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient} bg-opacity-10`}>
          <Icon className={`w-6 h-6 text-white`} style={{filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))'}} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</div>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

export default StatCard;