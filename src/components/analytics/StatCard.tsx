// components/StatCard.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  gradient,
}) => (
  <div className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 group hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
    <div
      className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
    ></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${gradient} bg-opacity-20 backdrop-blur-sm border border-white/10`}
        >
          <Icon
            className={`w-6 h-6 text-white`}
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))" }}
          />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {value.toLocaleString()}
          </div>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-300 mb-1">{title}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  </div>
);

export default StatCard;
