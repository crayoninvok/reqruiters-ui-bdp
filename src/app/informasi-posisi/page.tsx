"use client";
import { useState } from "react";
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
  category:
    | "production"
    | "technical"
    | "administration"
    | "safety"
    | "logistics"
    | "hse";
}

interface RecruitmentStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
}

// All positions from your Prisma enum
const allPositions: PositionInfo[] = [
  // Production Department
  {
    id: "PROD_ENG_SPV",
    title: "Production Engineering Supervisor",
    department: "Production",
    category: "production",
  },
  {
    id: "PRODUCTION_GROUP_LEADER",
    title: "Production Group Leader",
    department: "Production",
    category: "production",
  },
  {
    id: "PRODUCTION_DEPARTMENT_HEAD",
    title: "Production Department Head",
    department: "Production",
    category: "production",
  },
  {
    id: "MOCO_LEADER",
    title: "MOCO Leader",
    department: "Production",
    category: "production",
  },
  {
    id: "DRIVER_DT",
    title: "Driver DT",
    department: "Production",
    category: "production",
  },
  {
    id: "SIDE_DUMP_SPOTTER",
    title: "Side Dump Spotter",
    department: "Production",
    category: "production",
  },

  // Technical/Maintenance
  {
    id: "MECHANIC_JR",
    title: "Junior Mechanic",
    department: "Maintenance",
    category: "technical",
  },
  {
    id: "MECHANIC_SR",
    title: "Senior Mechanic",
    department: "Maintenance",
    category: "technical",
  },
  {
    id: "MECHANIC_INSTRUCTOR",
    title: "Mechanic Instructor",
    department: "Maintenance",
    category: "technical",
  },
  {
    id: "WELDER",
    title: "Welder",
    department: "Maintenance",
    category: "technical",
  },
  {
    id: "ELECTRICIAN",
    title: "Electrician",
    department: "Maintenance",
    category: "technical",
  },
  {
    id: "TYREMAN",
    title: "Tyreman",
    department: "Maintenance",
    category: "technical",
  },
  {
    id: "FABRICATION",
    title: "Fabrication",
    department: "Maintenance",
    category: "technical",
  },
  {
    id: "TYRE_GROUP_LEADER",
    title: "Tyre Group Leader",
    department: "Maintenance",
    category: "technical",
  },

  // Plant Operations
  {
    id: "PLANT_GROUP_LEADER",
    title: "Plant Group Leader",
    department: "Plant Operations",
    category: "production",
  },
  {
    id: "PLANT_ADMIN",
    title: "Plant Administrator",
    department: "Plant Operations",
    category: "administration",
  },
  {
    id: "OPERATOR_FUEL_TRUCK",
    title: "Fuel Truck Operator",
    department: "Plant Operations",
    category: "technical",
  },

  // Logistics
  {
    id: "LOGISTIC_SPV",
    title: "Logistics Supervisor",
    department: "Logistics",
    category: "logistics",
  },
  {
    id: "LOGISTIC_GROUP_LEADER",
    title: "Logistics Group Leader",
    department: "Logistics",
    category: "logistics",
  },
  {
    id: "LOGISTIC_ADMIN",
    title: "Logistics Administrator",
    department: "Logistics",
    category: "administration",
  },

  // Planning
  {
    id: "PLAN_SPV",
    title: "Planning Supervisor",
    department: "Planning",
    category: "administration",
  },
  {
    id: "PLANNER",
    title: "Planner",
    department: "Planning",
    category: "administration",
  },

  // Administration
  {
    id: "CCR_ADMIN",
    title: "CCR Administrator",
    department: "Administration",
    category: "administration",
  },
  {
    id: "WEIGHT_BRIDGE_ADMIN",
    title: "Weight Bridge Administrator",
    department: "Administration",
    category: "administration",
  },
  {
    id: "TYRE_ADMIN",
    title: "Tyre Administrator",
    department: "Administration",
    category: "administration",
  },
  {
    id: "PURCHASING_SPV",
    title: "Purchasing Supervisor",
    department: "Administration",
    category: "administration",
  },
  {
    id: "IT_SUPPORT",
    title: "IT Support",
    department: "Administration",
    category: "administration",
  },

  // HSE (Health, Safety, Environment)
  {
    id: "HSE_SPV",
    title: "HSE Supervisor",
    department: "HSE",
    category: "hse",
  },
  {
    id: "SAFETY_OFFICER",
    title: "Safety Officer",
    department: "HSE",
    category: "safety",
  },
  {
    id: "ENVIRONMENT_OFFICER",
    title: "Environment Officer",
    department: "HSE",
    category: "hse",
  },
  {
    id: "PARAMEDIC",
    title: "Paramedic",
    department: "HSE",
    category: "hse",
  },
  {
    id: "HSE_ADMIN",
    title: "HSE Administrator",
    department: "HSE",
    category: "administration",
  },
  {
    id: "DOCTOR",
    title: "Doctor",
    department: "HSE",
    category: "hse",
  },

  // HRGA
  {
    id: "HRGA_GROUP_LEADER",
    title: "HRGA Group Leader",
    department: "HRGA",
    category: "administration",
  },
  {
    id: "GA_GROUP_LEADER",
    title: "GA Group Leader",
    department: "HRGA",
    category: "administration",
  },
  {
    id: "PDCA_OFFICER",
    title: "PDCA Officer",
    department: "HRGA",
    category: "administration",
  },
  {
    id: "HRGA_SPV",
    title: "HRGA Supervisor",
    department: "HRGA",
    category: "administration",
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
  safety: "bg-red-100 text-red-800",
  logistics: "bg-orange-100 text-orange-800",
  hse: "bg-yellow-100 text-yellow-800",
};
const categoryIcons = {
  production: <Factory className="w-5 h-5" />,
  technical: <Wrench className="w-5 h-5" />,
  administration: <Briefcase className="w-5 h-5" />,
  safety: <Shield className="w-5 h-5" />,
  logistics: <Truck className="w-5 h-5" />,
  hse: "bg-pink-100 text-pink-800",
};

export default function InformasiPosisi() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPositions =
    selectedCategory === "all"
      ? allPositions
      : allPositions.filter((pos) => pos.category === selectedCategory);

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
            >
              Safety (
              {allPositions.filter((p) => p.category === "safety").length})
            </button>
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
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
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
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">
                  {position.title}
                </h3>

                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{position.department}</span>
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
