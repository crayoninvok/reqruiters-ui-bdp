"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Import your Navbar component

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current pathname

  // List of routes where the Navbar should not be displayed
  const noNavbarRoutes = [
    "/login",
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/recruitdata",
    "/dashboard/inputformdata",
    "/dashboard/profile",
  ];

  // Check if the current pathname starts with any of the no-navbar routes
  const shouldHideNavbar = noNavbarRoutes.some(route => pathname.startsWith(route));

  // If the current route matches any no-navbar route (including dynamic segments), don't render the Navbar
  return shouldHideNavbar ? (
    <>{children}</>
  ) : (
    <>
      <Navbar />
      {children}
    </>
  );
}