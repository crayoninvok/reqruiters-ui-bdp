"use client";
import React from "react";
import { Share2, Sparkles, TrendingUp } from "lucide-react";

interface User {
  name?: string;
  email?: string;
  role?: string;
}

interface HeroBannerProps {
  user: User | null;
  onShareClick: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ user, onShareClick }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bdp.jpg')",
        }}
      ></div>

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

      {/* Animated background elements */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse blur-2xl"></div>
      <div className="absolute bottom-12 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full animate-bounce blur-xl"></div>
      <div className="absolute top-1/2 left-8 w-16 h-16 bg-indigo-500/10 rounded-full animate-ping blur-lg"></div>

      {/* Content */}
      <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-12 lg:py-16">
        <div className="max-w-4xl">
          {/* Welcome badge */}
          <div className="mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs sm:text-sm font-medium border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Selamat Datang Kembali
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Halo,{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              {user?.name || user?.email?.split("@")[0] || "Pengguna"}!
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-200/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl">
            Kelola data rekrutmen Anda dengan efisien. Akses semua fitur dan sederhanakan alur kerja Anda dengan dashboard yang intuitif.
          </p>

          {/* Status and role info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-medium">Sistem Online</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-400/30">
              <TrendingUp className="w-4 h-4 text-blue-300" />
              <span className="text-blue-300 font-medium">Peran: {user?.role || "Pengguna"}</span>
            </div>
          </div>

          {/* Share button - responsive */}
          <div className="mt-6 sm:mt-8">
            <button
              onClick={onShareClick}
              className="group inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm sm:text-base">Bagikan Form</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};

export default HeroBanner;
