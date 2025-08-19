// app/layout.tsx
import { Metadata } from "next";
import localFont from "next/font/local";
import NavbarWrapper from "../components/NavbarWrapper"; // Import the NavbarWrapper
import { AuthProvider } from "@/context/useAuth"; // Add AuthProvider import
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
  title: "Recruitment Portal BDP",
  description: "PT Batara Dharma Persada Recruitment Portal",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap with AuthProvider first, then NavbarWrapper */}
        <AuthProvider>
          <NavbarWrapper>{children}</NavbarWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
