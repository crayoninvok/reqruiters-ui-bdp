"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // List of routes where the Navbar should not be displayed
  const noNavbarRoutes = [
    "/login",
    "/dashboard",
    "/recruitment-form",
  ];

  // List of routes where the Footer should NOT be displayed
  // User instruction: "jangan tampilkan pada saat apply form" (/recruitment-form)
  // Also dashboard and login have their own self-contained layout
  const noFooterRoutes = [
    "/recruitment-form",
    "/dashboard",
    "/login",
  ];

  const shouldHideNavbar = noNavbarRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const shouldHideFooter = noFooterRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <div className="flex-1 flex flex-col">{children}</div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}