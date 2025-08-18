"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/useAuth"; // Adjust the import path as needed

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20">
      {/* Background overlay with subtle animation */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative flex justify-between items-center px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link
            href="/"
            className="group flex items-center space-x-2 sm:space-x-3 text-white no-underline"
          >
            {/* Logo icon */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <img
                src="/logohr.svg"
                alt="BDP Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                BDP Recruitment Portal
              </span>
              <span className="text-xs text-purple-300 opacity-80 hidden sm:block">
                Building Dreams Together
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <NavLink href="/" label="Beranda" />
          <NavLink href="/informasi-posisi" label="Informasi Posisi" />
          <NavLink href="/tracking" label="Track Lamaran" />
          <NavLink href="/recruitment-form" label="Apply Sekarang" highlight />

          {isAuthenticated ? (
            <ProfileDropdown
              user={user}
              isOpen={isProfileDropdownOpen}
              onToggle={toggleProfileDropdown}
              onLogout={handleLogout}
              ref={profileDropdownRef}
            />
          ) : (
            <NavLink href="/login" label="Login" />
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMobileMenuOpen
                  ? "rotate-45 translate-y-1"
                  : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMobileMenuOpen
                  ? "-rotate-45 -translate-y-1"
                  : "translate-y-0.5"
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-black/20 backdrop-blur-sm`}
      >
        <div className="px-4 py-4 space-y-2">
          <MobileNavLink
            href="/tracking"
            label="Track Lamaran"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileNavLink
            href="/recruitment-form"
            label="Apply Sekarang"
            highlight
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {isAuthenticated ? (
            <MobileProfileSection
              user={user}
              onLogout={handleLogout}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          ) : (
            <MobileNavLink
              href="/login"
              label="Login"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    </nav>
  );
}

// Regular NavLink component
interface NavLinkProps {
  href: string;
  label: string;
  highlight?: boolean;
}

function NavLink({ href, label, highlight = false }: NavLinkProps) {
  const baseClasses =
    "relative px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 no-underline";
  const normalClasses =
    "text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-lg";
  const highlightClasses =
    "text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 hover:scale-105";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${
        highlight ? highlightClasses : normalClasses
      } group`}
    >
      {label}
      {/* Subtle underline effect for normal links */}
      {!highlight && (
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
      )}
    </Link>
  );
}

// Mobile NavLink component
interface MobileNavLinkProps {
  href: string;
  label: string;
  highlight?: boolean;
  onClick: () => void;
}

function MobileNavLink({
  href,
  label,
  highlight = false,
  onClick,
}: MobileNavLinkProps) {
  const baseClasses =
    "block w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300 no-underline";
  const normalClasses = "text-gray-300 hover:text-white hover:bg-white/10";
  const highlightClasses =
    "text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${
        highlight ? highlightClasses : normalClasses
      }`}
    >
      {label}
    </Link>
  );
}

// Profile Dropdown Component
interface ProfileDropdownProps {
  user: any; // Replace with your User type
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const ProfileDropdown = React.forwardRef<HTMLDivElement, ProfileDropdownProps>(
  ({ user, isOpen, onToggle, onLogout }, ref) => {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </span>
            )}
          </div>
          <span className="text-white text-sm font-medium hidden lg:block">
            {user?.name || user?.email}
          </span>
          <svg
            className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-purple-500/20 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-600">
              <p className="text-sm font-medium text-white">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>

            <Link
              href="/dashboard/profile"
              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              onClick={() => onToggle()}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Profile</span>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              onClick={() => onToggle()}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
                  />
                </svg>
                <span>Dashboard</span>
              </div>
            </Link>
            <div className="border-t border-gray-600 mt-1">
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ProfileDropdown.displayName = "ProfileDropdown";

// Mobile Profile Section
interface MobileProfileSectionProps {
  user: any; // Replace with your User type
  onLogout: () => void;
  onClose: () => void;
}

function MobileProfileSection({
  user,
  onLogout,
  onClose,
}: MobileProfileSectionProps) {
  return (
    <div className="border-t border-gray-600 pt-4 mt-4">
      <div className="flex items-center space-x-3 px-4 py-2 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name || "Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-lg font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() ||
                "U"}
            </span>
          )}
        </div>
        <div>
          <p className="text-white font-medium">{user?.name || "User"}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      <MobileNavLink
        href="/dashboard/profile"
        label="Profile"
        onClick={onClose}
      />
      <MobileNavLink href="/dashboard" label="Dashboard" onClick={onClose} />
      <MobileNavLink href="/settings" label="Settings" onClick={onClose} />

      <button
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="block w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-300 mt-2"
      >
        Logout
      </button>
    </div>
  );
}
