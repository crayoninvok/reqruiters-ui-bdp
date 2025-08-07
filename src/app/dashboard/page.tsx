"use client"
import React from "react";
import { useAuth } from "@/context/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-red-500">
          You are not logged in
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Welcome to your Dashboard, {user.name}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Here’s a quick overview of your account.
      </p>

      {/* User details */}
      <div className="space-y-4 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            User Info
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Email: {user.email}
          </p>
          <p className="text-gray-600 dark:text-gray-400">Role: {user.role}</p>
        </div>
      </div>

      {/* Example of other content */}
      <div className="mt-8">
        <button
          onClick={() => alert("You can add more functionality here!")}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Explore more features
        </button>
      </div>
    </div>
  );
}
