"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Shield,
  Wrench,
  Factory,
  Truck,
  Settings,
  HardHat,
  Heart,
  UserCheck,
} from "lucide-react";

interface PositionInfo {
  id: string;
  title: string;
  department: string;
  category: "production" | "technical" | "administration" | "logistics" | "hse";
  needed: number;
}

interface RecruitmentStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
}

// All positions from your staffing plan
const allPositions: PositionInfo[] = [
  // Management Department
  {
    id: "PROJECT_MANAGER",
    title: "Project Manager",
    department: "Management",
    category: "administration",
    needed: 1,
  },
  {
    id: "DEPUTY_PM",
    title: "Deputy PM",
    department: "Management",
    category: "administration",
    needed: 1,
  },

  // Production Department
  {
    id: "DH_PROD",
    title: "D.H Prod",
    department: "Production",
    category: "production",
    needed: 1,
  },
  {
    id: "SPV_PROD",
    title: "SPV Prod",
    department: "Production",
    category: "production",
    needed: 3,
  },
  {
    id: "GL_COALPAD",
    title: "GL Coalpad",
    department: "Production",
    category: "production",
    needed: 6,
  },
  {
    id: "GL_HAULING",
    title: "GL Hauling",
    department: "Production",
    category: "production",
    needed: 3,
  },
  {
    id: "GL_JETTY",
    title: "GL Jetty",
    department: "Production",
    category: "production",
    needed: 4,
  },
  {
    id: "INSTRUCTOR_PROD",
    title: "Instructor",
    department: "Production",
    category: "production",
    needed: 3,
  },
  {
    id: "MOCO",
    title: "Moco",
    department: "Production",
    category: "production",
    needed: 2,
  },

  // Plant Department
  {
    id: "DH_PLANTLOG",
    title: "DH PlantLog",
    department: "Plant",
    category: "logistics",
    needed: 1,
  },
  {
    id: "SPV_PLANT",
    title: "SPV Plant",
    department: "Plant",
    category: "production",
    needed: 3,
  },
  {
    id: "PLANNER",
    title: "Planner",
    department: "Plant",
    category: "administration",
    needed: 3,
  },
  {
    id: "ENGINEER",
    title: "Engineer",
    department: "Plant",
    category: "technical",
    needed: 1,
  },
  {
    id: "GL_PLANT",
    title: "GL Plant",
    department: "Plant",
    category: "production",
    needed: 5,
  },
  {
    id: "GL_FIELD",
    title: "GL Field",
    department: "Plant",
    category: "production",
    needed: 3,
  },
  {
    id: "GL_TIRE",
    title: "GL Tire",
    department: "Plant",
    category: "technical",
    needed: 3,
  },
  {
    id: "INSTRUCTOR_PLANT",
    title: "Instructor",
    department: "Plant",
    category: "technical",
    needed: 1,
  },
  {
    id: "GL_LOGISTIC",
    title: "GL Logistic",
    department: "Plant",
    category: "logistics",
    needed: 2,
  },

  // HSE Department
  {
    id: "DH_HSE",
    title: "DH HSE",
    department: "HSE",
    category: "hse",
    needed: 1,
  },
  {
    id: "SPV_HSE",
    title: "SPV HSE",
    department: "HSE",
    category: "hse",
    needed: 1,
  },
  {
    id: "OFFICER_HSE",
    title: "Officer HSE",
    department: "HSE",
    category: "hse",
    needed: 5,
  },
  {
    id: "OFFICER_ERT",
    title: "Officer ERT",
    department: "HSE",
    category: "hse",
    needed: 3,
  },
  {
    id: "PARAMEDIC",
    title: "Paramedic",
    department: "HSE",
    category: "hse",
    needed: 2,
  },

  // HRGA Department
  {
    id: "DH_HRGA",
    title: "DH HRGA",
    department: "HRGA",
    category: "administration",
    needed: 1,
  },
  {
    id: "SPV_HRGA",
    title: "SPV HRGA",
    department: "HRGA",
    category: "administration",
    needed: 1,
  },
  {
    id: "GL_HRGA",
    title: "GL HRGA",
    department: "HRGA",
    category: "administration",
    needed: 3,
  },
  {
    id: "GL_INFRASTRUCTURE",
    title: "GL INFRASTRUCTURE",
    department: "HRGA",
    category: "administration",
    needed: 2,
  },
  {
    id: "CSR",
    title: "CSR",
    department: "HRGA",
    category: "administration",
    needed: 1,
  },
  {
    id: "PDCA_OFFICER",
    title: "PDCA Officer",
    department: "HRGA",
    category: "administration",
    needed: 1,
  },
];

const recruitmentSteps: RecruitmentStep[] = [
  {
    step: 1,
    title: "Aplikasi Online",
    description: "Submit aplikasi dan dokumen lengkap melalui portal online",
    duration: "1 hari",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    step: 2,
    title: "Screening CV",
    description:
      "Tim HR akan melakukan review terhadap CV dan dokumen pendukung",
    duration: "3-5 hari",
    icon: <Users className="w-6 h-6" />,
  },
  {
    step: 3,
    title: "Interview HR",
    description:
      "Interview awal dengan tim HR untuk mengenal kandidat lebih lanjut",
    duration: "1-2 hari",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    step: 4,
    title: "Psikotes",
    description: "Tes psikologi untuk mengukur kemampuan dan karakter kandidat",
    duration: "1 hari",
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    step: 5,
    title: "Interview User",
    description:
      "Interview dengan user/atasan langsung untuk posisi yang dilamar",
    duration: "1-2 hari",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    step: 6,
    title: "Medical Check-up",
    description:
      "Pemeriksaan kesehatan lengkap di klinik yang ditunjuk perusahaan",
    duration: "1-2 hari",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    step: 7,
    title: "Keputusan Final",
    description: "Pengumuman hasil seleksi dan proses onboarding",
    duration: "2-3 hari",
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

const categoryColors = {
  production: "bg-blue-100 text-blue-800",
  technical: "bg-green-100 text-green-800",
  administration: "bg-purple-100 text-purple-800",
  logistics: "bg-orange-100 text-orange-800",
  hse: "bg-yellow-100 text-yellow-800",
};

const categoryIcons = {
  production: <Factory className="w-5 h-5" />,
  technical: <Wrench className="w-5 h-5" />,
  administration: <Briefcase className="w-5 h-5" />,
  logistics: <Truck className="w-5 h-5" />,
  hse: <Heart className="w-5 h-5" />,
};

export default function InformasiPosisi() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPositions =
    selectedCategory === "all"
      ? allPositions
      : allPositions.filter((pos) => pos.category === selectedCategory);

  // Calculate totals by department
  const departmentTotals = allPositions.reduce((acc, position) => {
    acc[position.department] =
      (acc[position.department] || 0) + position.needed;
    return acc;
  }, {} as Record<string, number>);

  const totalCandidatesNeeded = allPositions.reduce(
    (sum, pos) => sum + pos.needed,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Informasi Posisi Karir
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dengan tim Batara Dharma Persada dan kembangkan karir
              Anda dalam industri pertambangan yang dinamis dan profesional.
            </p>
          </div>
        </div>
      </section>

      {/* Recruitment Flow Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alur Proses Rekrutmen
            </h2>
            <p className="text-lg text-gray-600">
              Proses seleksi yang transparan dan profesional untuk mendapatkan
              kandidat terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-7 gap-4">
            {recruitmentSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    {step.icon}
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mb-1">
                    Step {step.step}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {step.description}
                  </p>
                  <div className="text-xs text-blue-600 font-medium">
                    {step.duration}
                  </div>
                </div>

                {index < recruitmentSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-12 px-6 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Total Kebutuhan Kandidat
            </h2>
            <div className="text-4xl font-bold text-blue-600 mb-4">
              {totalCandidatesNeeded} Kandidat
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(departmentTotals).map(([department, total]) => (
              <div
                key={department}
                className="bg-white rounded-lg p-4 text-center shadow-sm"
              >
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {department}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {total} kandidat
                </div>
              </div>
            ))}
          </div>

          {/* Apply Button */}
          <div className="text-center mt-8">
            <a
              href="/recruitment-form"
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Klik disini untuk melamar
            </a>
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Posisi yang Tersedia
            </h2>
            <p className="text-lg text-gray-600">
              Informasi lengkap posisi yang tersedia di Batara Dharma Persada
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Semua Posisi ({allPositions.length})
            </button>
            <button
              onClick={() => setSelectedCategory("production")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "production"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Production (
              {allPositions.filter((p) => p.category === "production").length})
            </button>
            <button
              onClick={() => setSelectedCategory("technical")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "technical"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Technical (
              {allPositions.filter((p) => p.category === "technical").length})
            </button>
            <button
              onClick={() => setSelectedCategory("administration")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "administration"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Administration (
              {
                allPositions.filter((p) => p.category === "administration")
                  .length
              }
              )
            </button>
            <button
              onClick={() => setSelectedCategory("logistics")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "logistics"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Logistics (
              {allPositions.filter((p) => p.category === "logistics").length})
            </button>
            <button
              onClick={() => setSelectedCategory("safety")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "safety"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            ></button>
            <button
              onClick={() => setSelectedCategory("hse")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "hse"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              HSE ({allPositions.filter((p) => p.category === "hse").length})
            </button>
          </div>

          {/* Positions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      categoryColors[position.category]
                    }`}
                  >
                    {categoryIcons[position.category]}
                    <span className="ml-1 capitalize">{position.category}</span>
                  </div>
                  <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {position.needed}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">
                  {position.title}
                </h3>

                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{position.department}</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-600 font-medium">
                    <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>Dibutuhkan: {position.needed} kandidat</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPositions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Tidak ada posisi yang ditemukan untuk kategori ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Karir Bersama Kami?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Jangan lewatkan kesempatan untuk bergabung dengan perusahaan
            terkemuka di industri pertambangan Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/recruitment-form"
              className="bg-white text-blue-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-center no-underline"
            >
              Apply Sekarang
            </a>
            <a
              href="/login"
              className="border border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 text-center no-underline"
            >
              HR Dashboard
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
