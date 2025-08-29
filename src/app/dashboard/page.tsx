"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/useAuth";
import { withGuard } from "@/components/withGuard";
import ShareModal from "@/components/home-dashboard/ShareModal";
import HeroBanner from "@/components/home-dashboard/HeroBanner";
import QuickActions from "@/components/home-dashboard/QuickAction";


function DashboardPage() {
  const { user } = useAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
      <HeroBanner user={user} onShareClick={handleShareClick} />

      {/* Quick Actions */}
      <QuickActions onShareClick={handleShareClick} />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        shareUrl="https://bdphrdatabase.vercel.app/recruitment-form"
      />
    </div>
  );
}

// Export the guarded component
export default withGuard(DashboardPage, {
  allowedRoles: ["HR", "ADMIN"],
  unauthorizedRedirect: "/custom-401",
});
