"use client";
import React from "react";
import { Share2 } from "lucide-react";

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
    <div className="relative h-80 lg:h-96 overflow-hidden rounded-2xl shadow-2xl">
      {/* Banner Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bdp.jpg')",
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>

      {/* Animated Background Elements */}
      <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-12 right-1/4 w-12 h-12 bg-blue-500/30 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 right-12 w-6 h-6 bg-purple-400/40 rounded-full animate-ping"></div>

      {/* Welcome Content */}
      <div className="relative z-10 h-full flex items-center justify-between px-8 lg:px-12">
        <div className="max-w-2xl">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/30">
              Welcome Back
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Hello,{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              {user?.name || user?.email}!
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-200 leading-relaxed mb-6">
            Ready to manage your recruitment data? Choose an option below to
            get started with your dashboard.
          </p>
          <div className="flex items-center text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Status: Online</span>
            </div>
            <div className="mx-4 w-1 h-1 bg-white/40 rounded-full"></div>
            <span>Role: {user?.role}</span>
          </div>
        </div>

        {/* Share Button in Hero Section */}
        <div className="hidden lg:block">
          <button
            onClick={onShareClick}
            className="group flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 transform hover:scale-105"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Form</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
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

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};

export default HeroBanner;