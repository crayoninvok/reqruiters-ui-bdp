"use client";
import React from "react";
import Link from "next/link";

interface ActionCardProps {
  title: string;
  titleColor?: string;
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
  titleColor,
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
      className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-64 flex flex-col justify-between ${gradientColors} border border-white/10`}
    >
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/3 rounded-full translate-y-8 -translate-x-8"></div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Enhanced Glare Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center mb-4">
          {/* Enhanced icon container */}
          <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
            {icon}
          </div>
          <div className="ml-auto">
            <span
              className={`inline-block w-3 h-3 ${statusColor} rounded-full animate-pulse shadow-sm`}
            ></span>
          </div>
        </div>

        <div className="flex-grow">
          {/* Enhanced title with better contrast */}
          <h3
            className={`text-xl font-bold mb-3 ${
              titleColor || "text-gray-100"
            } drop-shadow-sm`}
          >
            {title}
          </h3>
          {/* Enhanced description with better readability */}
          <p className="text-sm leading-relaxed text-gray-200 opacity-90 drop-shadow-sm">
            {description}
          </p>
        </div>

        {/* Enhanced action footer */}
        <div className="flex items-center justify-between text-gray-100 group-hover:translate-x-2 transition-transform duration-300 mt-4 pt-4 border-t border-white/10">
          <span className="font-medium text-sm tracking-wide">
            {actionText}
          </span>
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block">
        <CardContent />
      </Link>
    );
  }

  return (
    <div onClick={onClick} className="group block cursor-pointer">
      <CardContent />
    </div>
  );
};

export default ActionCard;
