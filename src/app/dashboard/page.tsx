"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { withAuthGuard, withGuard } from "@/components/withGuard";
import {
  X,
  Share2,
  MessageCircle,
  Linkedin,
  Instagram,
  Copy,
  Check,
  QrCode,
} from "lucide-react";

// ShareModal Component
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl = "https://bdphrdatabase.vercel.app/recruitment-form",
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        const message = `🚀 Join our team! Apply now through our recruitment portal: ${shareUrl}`;
        window.open(
          `https://wa.me/?text=${encodeURIComponent(message)}`,
          "_blank"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        const title = "Career Opportunity at BDP - Join Our Team!";
        const text = `🚀 We Are Hiring Now!! \n\n Exciting career opportunities available at PT.Batara Dharma Persada!\n\n✨ We're looking for talented individuals to join our growing team.\n\n📝 Apply now: ${shareUrl}\n\n#Bataramining #BataraDharmaPersada #BDP #Recruitment #BataraRecruitment`;

        // Use LinkedIn's post composer with pre-filled text
        window.open(
          `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
            text
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Instagram",
      icon: Instagram,
      color:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      action: () => {
        // Instagram doesn't support direct link sharing, so we'll copy the link
        copyToClipboard();
        alert(
          "Link copied! You can now paste it in your Instagram bio or story."
        );
      },
    },
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      color: copied ? "bg-green-500" : "bg-gray-600 hover:bg-gray-700",
      action: copyToClipboard,
    },
  ];

  const downloadQR = () => {
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = "/qrcode.jpg";
    link.download = "recruitment-form-qr.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Share Recruitment Form
              </h3>
              <p className="text-sm text-gray-500">
                Share this opportunity with others
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* URL Display */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-600 mb-2">Recruitment Form URL:</p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {shareUrl}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <QrCode className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">QR Code</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  showQR ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showQR && (
              <div className="mt-4 p-4 bg-white border rounded-lg">
                <div className="flex flex-col items-center">
                  <img
                    src="/qrcode.jpg"
                    alt="QR Code for Recruitment Form"
                    className="w-48 h-48 border rounded-lg mb-4"
                  />
                  <button
                    onClick={downloadQR}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Download QR Code
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Share Options */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">Share via:</p>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className={`flex items-center space-x-3 p-4 rounded-xl text-white transition-all duration-200 transform hover:scale-105 ${option.color}`}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="font-medium">{option.name}</span>
                </button>
              ))}
            </div>

            {/* Additional sharing tips */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                📱 Pro Tips:
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>
                  • <strong>LinkedIn:</strong> Opens with pre-written
                  professional post
                </li>
                <li>
                  • <strong>WhatsApp:</strong> Perfect for direct candidate
                  outreach
                </li>
                <li>
                  • <strong>QR Code:</strong> Great for print materials and
                  mobile scanning
                </li>
                <li>
                  • <strong>Instagram:</strong> Copy link for bio or story
                  sharing
                </li>
              </ul>
            </div>
          </div>

          {/* Success Message */}
          {copied && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Link copied to clipboard!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Share this link to help candidates easily access the recruitment
            form
          </p>
        </div>
      </div>
    </div>
  );
};

function DashboardPage() {
  const { user } = useAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
              onClick={() => setIsShareModalOpen(true)}
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

      {/* Quick Actions */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quick Actions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Access your most used features
            </p>
          </div>

          {/* Mobile Share Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    View and manage candidate profiles, track applications, and
                    analyze recruitment metrics in real-time.
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
                    Create new entries, update existing records, and manage your
                    database with our intuitive forms.
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

          {/* Share Recruitment Form Card */}
          <div
            onClick={() => setIsShareModalOpen(true)}
            className="group block cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-64 flex flex-col justify-between bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

              {/* Glare Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-auto">
                    <span className="inline-block w-3 h-3 bg-orange-400 rounded-full animate-pulse"></span>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3">
                    Share Form
                  </h3>
                  <p className="text-purple-100 text-base leading-relaxed">
                    Share the recruitment form link with candidates via
                    WhatsApp, LinkedIn, Instagram, or copy the direct link.
                  </p>
                </div>

                <div className="flex items-center justify-between text-white group-hover:translate-x-2 transition-transform duration-300 mt-4">
                  <span className="font-semibold">Share Now</span>
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
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
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
