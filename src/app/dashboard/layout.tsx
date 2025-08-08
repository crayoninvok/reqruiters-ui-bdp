// dashboard/layout.tsx
"use client";
import React from "react";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <div className="text-2xl font-bold mb-4">Dashboard</div>
        <ul className="space-y-4">
          <li>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white mt-6"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
