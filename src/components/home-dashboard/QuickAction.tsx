"use client";
import React from "react";
import { Share2, Users, Edit, ArrowRight } from "lucide-react";
import ActionCard from "./ActionCard";

interface QuickActionsProps {
  onShareClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onShareClick }) => {
  const actionCards = [
    {
      title: "Recruitment Data",
      description:
        "View and manage candidate profiles, track applications, and analyze recruitment metrics in real-time.",
      icon: <Users className="w-6 h-6 text-white" />,
      gradientColors:
        "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800",
      statusColor: "bg-green-400",
      actionText: "Explore Data",
      href: "/dashboard/recruitdata",
    },
    {
      title: "Input Form Data",
      description:
        "Create new entries, update existing records, and manage your database with our intuitive forms.",
      icon: <Edit className="w-6 h-6 text-white" />,
      gradientColors:
        "bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800",
      statusColor: "bg-yellow-400",
      actionText: "Start Inputting",
      href: "/dashboard/inputformdata",
    },
    {
      title: "Share Form",
      description:
        "Share the recruitment form link with candidates via WhatsApp, LinkedIn, Instagram, or copy the direct link.",
      icon: <Share2 className="w-6 h-6 text-white" />,
      gradientColors:
        "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700",
      statusColor: "bg-orange-400",
      actionText: "Share Now",
      onClick: onShareClick,
    },
  ];

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-100">Quick Actions</h2>
          <p className="text-lg text-gray-300">
            Access your most used features and streamline your workflow
          </p>
        </div>

        {/* Mobile Share Button */}
        <div className="lg:hidden">
          <button
            onClick={onShareClick}
            className="group flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actionCards.map((card, index) => (
          <ActionCard
            key={`action-card-${index}`}
            title={card.title}
            description={card.description}
            icon={card.icon}
            gradientColors={card.gradientColors}
            statusColor={card.statusColor}
            actionText={card.actionText}
            href={card.href}
            onClick={card.onClick}
          />
        ))}
      </div>

      {/* Enhanced Pro Tips Section - Fixed for Dark Theme */}
      <div className="mt-8 p-6 bg-gradient-to-r from-slate-800/80 via-gray-800/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600/30 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl border border-blue-400/20 backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center space-x-2">
              <span>Pro Tips for Better Productivity</span>
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-400/30">
                TIPS
              </span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-sm shadow-blue-400/50"></div>
                </div>
                <span className="text-sm text-gray-300 leading-relaxed">
                  Use the{" "}
                  <strong className="text-blue-300 font-semibold">
                    Share Form
                  </strong>{" "}
                  feature to quickly distribute recruitment links across
                  multiple platforms
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm shadow-green-400/50"></div>
                </div>
                <span className="text-sm text-gray-300 leading-relaxed">
                  Track candidate progress in{" "}
                  <strong className="text-green-300 font-semibold">
                    Recruitment Data
                  </strong>{" "}
                  with real-time analytics and insights
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-sm shadow-purple-400/50"></div>
                </div>
                <span className="text-sm text-gray-300 leading-relaxed">
                  Streamline data entry with our intuitive{" "}
                  <strong className="text-purple-300 font-semibold">
                    Input Forms
                  </strong>{" "}
                  for faster processing and accuracy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Subtle bottom accent */}
        <div className="mt-4 pt-4 border-t border-slate-600/20">
          <p className="text-xs text-gray-400 flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Boost your productivity with these workflow optimizations
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
