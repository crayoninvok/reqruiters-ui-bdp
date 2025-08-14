// app/401/page.tsx (or pages/401.tsx for Pages Router)
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 text-center max-w-lg">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Error Code */}
        <div className="text-6xl font-bold text-red-400 mb-4">401</div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-white">Unauthorized Access</h1>
        
        {/* Description */}
        <p className="text-slate-300 mb-8 leading-relaxed">
          You don't have permission to access this resource. This could be because:
        </p>
        
        {/* Reasons List */}
        <ul className="text-slate-400 text-left mb-8 space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
            You're not logged in
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
            Your session has expired
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
            You don't have the required permissions
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 border border-slate-600"
          >
            Go Back
          </button>
          
          <Link
            href="/login"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
          >
            Sign In
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 border border-slate-600 text-center"
          >
            Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-slate-500 text-sm">
        <p>Need help? <Link href="/support" className="text-purple-400 hover:text-purple-300">Contact Support</Link></p>
      </div>
    </div>
  );
}