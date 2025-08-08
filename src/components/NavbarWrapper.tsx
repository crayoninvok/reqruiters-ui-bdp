"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Import your Navbar component

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current pathname

  // List of routes where the Navbar should not be displayed
  const noNavbarRoutes = [
    "/login",
    "/dashboard"
  ];

  // If the current route is in the noNavbarRoutes array, don't render the Navbar
  return noNavbarRoutes.includes(pathname) ? <>{children}</> : <><Navbar />{children}</>;
}
