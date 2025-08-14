"use client";
import React from "react";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { withAuthGuard, withGuard } from "@/components/withGuard";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
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
        <div className="relative z-10 h-full flex items-center justify-start px-8 lg:px-12">
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
              Ready to manage your recruitment data? Choose an option below to get started with your dashboard.
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
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Access your most used features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recruitment Data Card */}
          <Link href="/dashboard/recruitdata" className="group block">
            <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-64 flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
              
              {/* Glare Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3">
                    Recruitment Data
                  </h3>
                  <p className="text-blue-100 text-base leading-relaxed">
                    View and manage candidate profiles, track applications, and analyze recruitment metrics in real-time.
                  </p>
                </div>

                <div className="flex items-center justify-between text-white group-hover:translate-x-2 transition-transform duration-300 mt-4">
                  <span className="font-semibold">Explore Data</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
                </div>
              </div>
            </div>
          </Link>

          {/* Input Form Data Card */}
          <Link href="/dashboard/inputformdata" className="group block">
            <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-64 flex flex-col justify-between bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
              
              {/* Glare Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3">
                    Input Form Data
                  </h3>
                  <p className="text-green-100 text-base leading-relaxed">
                    Create new entries, update existing records, and manage your database with our intuitive forms.
                  </p>
                </div>

                <div className="flex items-center justify-between text-white group-hover:translate-x-2 transition-transform duration-300 mt-4">
                  <span className="font-semibold">Start Inputting</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Export the guarded component
export default withGuard(DashboardPage, {
  allowedRoles: ['HR', 'ADMIN'],
  unauthorizedRedirect: '/custom-401'
});