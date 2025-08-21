"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/useAuth";
import Sidebar from "@/components/layout-dashboard/Sidebar";
import MobileHeader from "@/components/layout-dashboard/MobileHeader"; 
import { useLogoutHandler } from "@/components/layout-dashboard/useLogoutHandler";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { handleLogout } = useLogoutHandler();

  useEffect(() => {
    console.log(user); // Ensure user data is correct
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}