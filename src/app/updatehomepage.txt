import { useState } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

interface StatCardProps {
  number: string;
  label: string;
}

// Mock Footer component since it's not defined
function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <img
                src="/bdplogo01.png"
                alt="Batara Dharma Persada Logo"
                className="h-14 w-auto mr-4"
              />
              <h3 className="text-xl text-teal-600 font-semibold">
                Dharma Persada
              </h3>
            </div>
            <p className="text-slate-300">
              Professional HR management solution for modern organizations.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a
                href="https://www.bataramining.com"
                className="block text-slate-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                About Us
              </a>
              <a
                href="https://www.bataramining.com/kontak"
                className="block text-slate-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <a href="/help" className="block text-slate-300 hover:text-white">
                Help Center
              </a>
              <a
                href="/privacy"
                className="block text-slate-300 hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="block text-slate-300 hover:text-white"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Batara Dharma Persada. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen px-4 sm:px-6 overflow-hidden flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/staffteam.JPG"
            alt="Staff team background"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay for better text readability - darker from top to bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/60"></div>
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-tight">
              <span className="block text-blue-200 font-medium text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-4">
                PT
                <span className=" text-teal-600 font-medium text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-4">
                  {" "}
                  Batara
                </span>{" "}
                Dharma Persada
              </span>
              <span className="block">HR Management</span>
              <span className="block text-blue-200 font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl mt-2 sm:mt-4">
                Simplified
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-50 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
              Permudah pengelolaan data rekrutmen karyawan dengan platform
              profesional dan aman yang dirancang untuk organisasi modern dan
              mudah.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6 sm:pt-8 px-4">
              <a
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center"
              >
                HR Dashboard
              </a>
              <a
                href="/recruitment-form"
                className="bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white text-slate-700 font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-200 shadow-sm hover:shadow-md text-center"
              >
                Apply Sekarang!
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-900 mb-3 sm:mb-4">
              Core Features
            </h2>
            <p className="text-base sm:text-lg text-slate-600 px-4">
              Everything you need for efficient HR operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon="👥"
              title="Employee Data"
              description="Centralized employee information management with secure access controls and comprehensive profiles."
            />
            <FeatureCard
              icon="📄"
              title="Document Management"
              description="Upload, store, and organize essential documents including contracts, certifications, and records."
            />
            <FeatureCard
              icon="⚙️"
              title="System Configuration"
              description="Customizable workflows and settings tailored to your organization's specific requirements."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="256-bit" label="Encryption" />
            <StatCard number="24/7" label="Support" />
            <StatCard number="ISO 27001" label="Certified" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center p-4 sm:p-6 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-blue-50 rounded-full flex items-center justify-center text-2xl sm:text-3xl">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-medium text-slate-900 mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="py-2">
      <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1">
        {number}
      </div>
      <div className="text-xs sm:text-sm text-blue-100">{label}</div>
    </div>
  );
}
