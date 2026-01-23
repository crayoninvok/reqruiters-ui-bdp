"use client";
import React from "react";
import { Share2, Users, Edit, Lightbulb, Sparkles } from "lucide-react";
import ActionCard from "./ActionCard";

interface QuickActionsProps {
  onShareClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onShareClick }) => {
  const actionCards = [
    {
      title: "Data Rekrutmen",
      description:
        "Lihat dan kelola profil kandidat, lacak aplikasi, dan analisis metrik rekrutmen secara real-time.",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
      gradientColors:
        "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600",
      statusColor: "bg-green-400",
      actionText: "Jelajahi Data",
      href: "/dashboard/recruitdata",
    },
    {
      title: "Bagikan Form",
      description:
        "Bagikan tautan form rekrutmen dengan kandidat melalui WhatsApp, LinkedIn, Instagram, atau salin tautan langsung.",
      icon: <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
      gradientColors:
        "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600",
      statusColor: "bg-orange-400",
      actionText: "Bagikan Sekarang",
      onClick: onShareClick,
    },
  ];

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
              Aksi Cepat
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
              Akses fitur yang paling sering digunakan dan sederhanakan alur kerja Anda
            </p>
          </div>

          {/* Mobile Share Button */}
          <div className="lg:hidden">
            <button
              onClick={onShareClick}
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Enhanced Pro Tips Section */}
      <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-600/30 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2.5 sm:p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg sm:rounded-xl border border-blue-400/20 backdrop-blur-sm">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2 flex-wrap">
              <span>Tips Produktivitas</span>
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-400/30">
                TIPS
              </span>
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-sm shadow-blue-400/50"></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Gunakan fitur{" "}
                  <strong className="text-blue-300 font-semibold">
                    Bagikan Form
                  </strong>{" "}
                  untuk dengan cepat membagikan tautan rekrutmen di berbagai
                  platform
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm shadow-green-400/50"></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Lacak kemajuan kandidat di{" "}
                  <strong className="text-green-300 font-semibold">
                    Data Rekrutmen
                  </strong>{" "}
                  dengan analitik dan wawasan real-time
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-sm shadow-purple-400/50"></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Sederhanakan entri data dengan{" "}
                  <strong className="text-purple-300 font-semibold">
                    Form Input
                  </strong>{" "}
                  yang intuitif untuk pemrosesan lebih cepat dan akurat
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-4 pt-4 border-t border-slate-600/20">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Tingkatkan produktivitas Anda dengan optimisasi alur kerja ini
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
