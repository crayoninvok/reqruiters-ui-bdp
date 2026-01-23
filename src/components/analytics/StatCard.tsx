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
  <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-600/30 p-4 sm:p-6 group hover:shadow-2xl hover:border-slate-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
    <div
      className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
    ></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div
          className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${gradient} bg-opacity-20 backdrop-blur-sm border border-white/10 shadow-md`}
        >
          <Icon
            className={`w-5 h-5 sm:w-6 sm:h-6 text-white`}
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))" }}
          />
        </div>
        <div className="text-right">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            {value.toLocaleString()}
          </div>
        </div>
      </div>
      <h3 className="text-xs sm:text-sm font-semibold text-gray-200 mb-1">{title}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  </div>
);

export default StatCard;
