import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

interface StatCardProps {
  number: string;
  label: string;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen px-6 overflow-hidden flex items-start">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/staffteam.JPG"
            alt="Staff team background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay for better text readability - darker from top to bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/60"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 pt-16">
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-light text-white leading-tight">
              HR Management
              <span className="block text-blue-200 font-medium">
                Simplified
              </span>
            </h1>
            <p className="text-2xl text-blue-50 max-w-3xl mx-auto leading-relaxed">
              Streamline employee data management with our professional, secure
              platform built for modern organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Access Platform
              </Link>
              <Link
                href="/recruitment-form"
                className="bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white text-slate-700 font-medium py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-slate-900 mb-4">
              Core Features
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need for efficient HR operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="/team.svg"
              title="Employee Data"
              description="Centralized employee information management with secure access controls and comprehensive profiles."
            />
            <FeatureCard
              icon="/documentation.svg"
              title="Document Management"
              description="Upload, store, and organize essential documents including contracts, certifications, and records."
            />
            <FeatureCard
              icon="/settings.svg"
              title="System Configuration"
              description="Customizable workflows and settings tailored to your organization's specific requirements."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
    <div className="text-center p-6 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
      <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
        <Image
          src={icon}
          alt={`${title} icon`}
          width={32}
          height={32}
          className="opacity-80"
        />
      </div>
      <h3 className="text-xl font-medium text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div>
      <div className="text-2xl font-semibold text-white mb-1">{number}</div>
      <div className="text-sm text-blue-100">{label}</div>
    </div>
  );
}