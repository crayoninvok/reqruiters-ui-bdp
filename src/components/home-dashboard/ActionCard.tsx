"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientColors: string;
  statusColor: string;
  actionText: string;
  href?: string;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  gradientColors,
  statusColor,
  actionText,
  href,
  onClick,
}) => {
  const CardContent = () => (
    <div
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl min-h-[200px] sm:min-h-[240px] flex flex-col justify-between ${gradientColors} border border-white/10 backdrop-blur-sm`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/3 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>

      {/* Glare Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Icon and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 sm:p-3 bg-white/15 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 shadow-md">
            {icon}
          </div>
          <span
            className={`inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 ${statusColor} rounded-full animate-pulse shadow-sm`}
          ></span>
        </div>

        {/* Title and Description */}
        <div className="flex-grow mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 drop-shadow-sm">
            {title}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-white/90 drop-shadow-sm line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
          <span className="font-semibold text-xs sm:text-sm text-white tracking-wide">
            {actionText}
          </span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>

      {/* Bottom accent on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <CardContent />
      </Link>
    );
  }

  return (
    <div onClick={onClick} className="block cursor-pointer">
      <CardContent />
    </div>
  );
};

export default ActionCard;
