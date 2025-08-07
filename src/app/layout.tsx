// app/layout.tsx
import { Metadata } from "next";
import localFont from "next/font/local";
import NavbarWrapper from "../components/NavbarWrapper"; // Import the NavbarWrapper
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Database HR BDP",
  description: "CRUD operations for HR database",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the children with NavbarWrapper */}
        <NavbarWrapper>
          {children}
        </NavbarWrapper>
      </body>
    </html>
  );
}
