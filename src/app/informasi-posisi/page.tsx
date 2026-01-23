"use client";
import React, { useState, useEffect } from "react";
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
  Loader2,
  Lock,
  X,
  Calendar,
  Ruler,
  Scale,
  BriefcaseBusiness,
} from "lucide-react";
import { FormSettingsService, FormSettings } from "@/services/form-settings.service";
import { Position } from "@/types/types";

interface PositionInfo {
  id: string;
  title: string;
  department: string;
  category: "production" | "technical" | "administration" | "logistics" | "hse";
  needed: number;
}

// Helper function to format position enum to readable title
const formatPositionTitle = (position: Position): string => {
  return position.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to categorize position
const categorizePosition = (position: Position): "production" | "technical" | "administration" | "logistics" | "hse" => {
  const pos = position.toUpperCase();
  if (pos.includes("HSE") || pos.includes("SAFETY") || pos.includes("ENVIRONMENT") || pos.includes("PARAMEDIC") || pos.includes("ERT") || pos.includes("B3") || pos.includes("K3")) {
    return "hse";
  }
  if (pos.includes("LOGISTIC") || pos.includes("DRIVER") || pos.includes("HAULING") || pos.includes("WEIGHT_BRIDGE") || pos.includes("SIDE_DUMP")) {
    return "logistics";
  }
  if (pos.includes("MECHANIC") || pos.includes("WELDER") || pos.includes("ELECTRICIAN") || pos.includes("TYRE") || pos.includes("FABRICATION") || pos.includes("OPERATOR") || pos.includes("CRANE") || pos.includes("FUEL") || pos.includes("WATER") || pos.includes("GARBAGE")) {
    return "technical";
  }
  if (pos.includes("HR") || pos.includes("ADMIN") || pos.includes("PLANNER") || pos.includes("IT") || pos.includes("PURCHASING") || pos.includes("PROCUREMENT") || pos.includes("PDCA") || pos.includes("INFRASTRUCTURE") || pos.includes("TOOLKEEPER") || pos.includes("CAMP_SERVICE")) {
    return "administration";
  }
  return "production";
};

// Helper function to get department from position
const getDepartmentFromPosition = (position: Position): string => {
  const pos = position.toUpperCase();
  if (pos.includes("HSE") || pos.includes("SAFETY") || pos.includes("ENVIRONMENT") || pos.includes("PARAMEDIC") || pos.includes("ERT") || pos.includes("B3") || pos.includes("K3")) {
    return "HSE";
  }
  if (pos.includes("HR") || pos.includes("GA") || pos.includes("PDCA") || pos.includes("INFRASTRUCTURE") || pos.includes("CAMP_SERVICE")) {
    return "HRGA";
  }
  if (pos.includes("PLANT") || pos.includes("LOGISTIC") || pos.includes("DRIVER") || pos.includes("HAULING") || pos.includes("WEIGHT_BRIDGE") || pos.includes("SIDE_DUMP") || pos.includes("TYRE") || pos.includes("MECHANIC") || pos.includes("WELDER") || pos.includes("ELECTRICIAN") || pos.includes("FABRICATION") || pos.includes("OPERATOR") || pos.includes("CRANE") || pos.includes("FUEL") || pos.includes("WATER") || pos.includes("GARBAGE")) {
    return "Plant & Logistic";
  }
  if (pos.includes("PURCHASING") || pos.includes("PROCUREMENT")) {
    return "Purchasing";
  }
  return "Production Engineering";
};

interface RecruitmentStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
}

// DEPRECATED: All positions from your staffing plan (now using dynamic data from form settings)
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
  production: "bg-blue-100 text-blue-800 border border-blue-200",
  technical: "bg-green-100 text-green-800 border border-green-200",
  administration: "bg-purple-100 text-purple-800 border border-purple-200",
  logistics: "bg-orange-100 text-orange-800 border border-orange-200",
  hse: "bg-yellow-100 text-yellow-800 border border-yellow-200",
};

const categoryIcons = {
  production: <Factory className="w-5 h-5" />,
  technical: <Wrench className="w-5 h-5" />,
  administration: <Briefcase className="w-5 h-5" />,
  logistics: <Truck className="w-5 h-5" />,
  hse: <Heart className="w-5 h-5" />,
};

export default function InformasiPosisi() {
  const [formSettings, setFormSettings] = useState<FormSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [allAvailablePositions, setAllAvailablePositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<PositionInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch form settings and available positions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [settingsResponse, optionsResponse] = await Promise.all([
          FormSettingsService.getFormSettings(),
          import("@/services/public-recruitment.service").then(module => 
            module.PublicRecruitmentService.getFormOptions()
          ),
        ]);

        setFormSettings(settingsResponse.formSettings);
        
        // Get all available positions from options
        if (optionsResponse.options?.positions) {
          setAllAvailablePositions(optionsResponse.options.positions as Position[]);
        }
      } catch (error) {
        console.error("Error fetching form settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Build positions list based on form settings
  const buildPositionsList = (): PositionInfo[] => {
    if (!formSettings || !formSettings.isFormOpen) {
      return [];
    }

    // Determine which positions to show
    let positionsToShow: Position[] = [];
    
    if (formSettings.openPositions && formSettings.openPositions.length > 0) {
      // Show only specific positions that are open
      positionsToShow = formSettings.openPositions;
    } else {
      // Show all available positions
      positionsToShow = allAvailablePositions;
    }

    // Build position info list
    return positionsToShow.map((position) => {
      const needed = formSettings.positionCounts?.[position] || 1;
      return {
        id: position,
        title: formatPositionTitle(position),
        department: getDepartmentFromPosition(position),
        category: categorizePosition(position),
        needed: needed,
      };
    });
  };

  const positions = buildPositionsList();

  const handleCardClick = (position: PositionInfo) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-300">Memuat informasi posisi...</p>
        </div>
      </div>
    );
  }

  // Show message if form is closed
  if (!formSettings || !formSettings.isFormOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <section className="relative overflow-hidden py-24 px-6">
          {/* Coal Mining Background */}
          <div className="absolute inset-0">
            <img
              src="/coal.avif"
              alt="Coal Mining"
              className="w-full h-full object-cover opacity-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center">
              {/* Lock Icon with animation */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-full shadow-2xl border-2 border-gray-700">
                    <Lock className="w-20 h-20 text-amber-400" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Lowongan Saat Ini Ditutup
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                Saat ini tidak ada lowongan yang tersedia. Kami sedang tidak membuka rekrutmen untuk sementara waktu.
              </p>
              
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-gray-700 max-w-2xl mx-auto">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Kapan Lowongan Dibuka?
                    </h3>
                    <p className="text-gray-300">
                      Kami akan membuka lowongan kembali dalam waktu dekat. Silakan pantau halaman ini secara berkala atau hubungi tim HR untuk informasi lebih lanjut.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-amber-500/50 transform hover:-translate-y-0.5 border-2 border-amber-400"
                >
                  Kembali ke Beranda
                </a>
                <a
                  href="/tracking"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-gray-300 font-medium rounded-lg border-2 border-gray-700 hover:border-amber-500 hover:text-amber-400 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Track Lamaran Saya
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Hero Section - Full Viewport Height */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-800 to-black text-white min-h-screen flex items-center justify-center">
        {/* Coal Mining Background Image - Full Coverage */}
        <div className="absolute inset-0">
          <img
            src="/coal.avif"
            alt="Coal Mining"
            className="w-full h-full object-cover opacity-30"
            onError={(e) => {
              // Fallback jika gambar tidak ada
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/65"></div>
        </div>
        
        {/* Mining Equipment Pattern Overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-40 h-40 border-4 border-amber-500/40 rounded-full"></div>
          <div className="absolute top-60 right-32 w-32 h-32 border-4 border-amber-500/30 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-48 h-48 border-4 border-amber-500/35 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-36 h-36 border-4 border-amber-500/25 rounded-full"></div>
        </div>
        
        {/* Content Container - Centered */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-amber-500/30 to-amber-600/40 backdrop-blur-sm rounded-full mb-6 md:mb-8 border-3 border-amber-500/40 shadow-2xl shadow-amber-500/30">
              <HardHat className="w-12 h-12 md:w-14 md:h-14 text-amber-400" />
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
                Lowongan Kerja
              </span>
              <br />
              <span className="text-white drop-shadow-lg">Hauling Services Batubara</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-6 drop-shadow">
              Bergabunglah dengan tim <span className="text-amber-400 font-semibold">Batara Dharma Persada</span> dan kembangkan karir
              Anda dalam industri pertambangan batubara yang dinamis dan profesional.
            </p>
            
            {/* Info Box */}
            {formSettings.reason && (
              <div className="mt-6 inline-block bg-amber-500/25 backdrop-blur-md rounded-lg px-6 py-3 md:px-8 md:py-4 border-2 border-amber-500/40 shadow-xl">
                <p className="text-amber-100 text-sm md:text-base font-medium">
                  <strong className="text-amber-300">Info:</strong> {formSettings.reason}
                </p>
              </div>
            )}
            
            {/* Due Date */}
            {formSettings.dueDate && (
              <p className="mt-4 text-gray-200 text-base md:text-lg flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                Lowongan ditutup pada: <span className="text-amber-400 font-semibold">{new Date(formSettings.dueDate).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mb-4 shadow-lg shadow-amber-500/50">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Posisi yang Tersedia
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Informasi lengkap posisi yang tersedia di Batara Dharma Persada
            </p>
          </div>

          {/* Positions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {positions.map((position) => (
              <div
                key={position.id}
                onClick={() => handleCardClick(position)}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 p-6 shadow-md hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden cursor-pointer hover:border-amber-500/50"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-600/0 group-hover:from-amber-500/10 group-hover:to-amber-600/10 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm bg-gray-700 text-gray-300 border border-gray-600`}
                    >
                      {categoryIcons[position.category]}
                      <span className="ml-1.5 capitalize">{position.category}</span>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-sm font-bold px-3 py-1.5 rounded-full shadow-lg border border-amber-400">
                      {position.needed}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-3 leading-tight group-hover:text-amber-400 transition-colors">
                    {position.title}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-300">
                      <Briefcase className="w-4 h-4 mr-2 flex-shrink-0 text-amber-400" />
                      <span className="truncate font-medium">{position.department}</span>
                    </div>
                    <div className="flex items-center text-sm bg-amber-500/20 text-amber-300 font-semibold px-3 py-2 rounded-lg border border-amber-500/30">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Dibutuhkan: {position.needed} kandidat</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {positions.length === 0 && (
            <div className="text-center py-16 col-span-full">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4 border border-gray-700">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-300 mb-2">
                Tidak ada posisi yang tersedia
              </p>
              <p className="text-gray-500">
                Silakan periksa kembali nanti.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recruitment Flow Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-800 via-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mb-4 shadow-lg shadow-amber-500/50">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Alur Proses Rekrutmen
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Proses seleksi yang transparan dan profesional untuk mendapatkan
              kandidat terbaik di industri pertambangan
            </p>
          </div>

          <div className="grid md:grid-cols-7 gap-6">
            {recruitmentSteps.map((step, index) => (
              <div key={step.step} className="relative group">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl p-6 text-center hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-600/0 group-hover:from-amber-500/10 group-hover:to-amber-600/10 transition-all duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/50 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div className="text-xs font-bold text-amber-400 mb-2 uppercase tracking-wide">
                      Step {step.step}
                    </div>
                    <h3 className="font-bold text-white mb-3 text-sm leading-tight group-hover:text-amber-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-300 mb-3 leading-relaxed min-h-[3rem]">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 font-semibold px-3 py-1.5 rounded-full border border-amber-500/30">
                      <Clock className="w-3 h-3" />
                      {step.duration}
                    </div>
                  </div>
                </div>

                {index < recruitmentSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-1 shadow-lg border-2 border-amber-400">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        {/* Coal Mining Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/coal.avif"
            alt="Coal Mining Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
        
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/30 to-amber-600/40 backdrop-blur-sm rounded-full mb-6 border-2 border-amber-500/30 shadow-lg shadow-amber-500/20">
            <HardHat className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Siap Memulai Karir
            </span>
            <br />
            <span className="text-white">Bersama Kami?</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Jangan lewatkan kesempatan untuk bergabung dengan perusahaan
            terkemuka di industri <span className="text-amber-400 font-semibold">pertambangan batubara</span> Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/recruitment-form"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-4 px-10 rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:shadow-amber-500/50 transform hover:-translate-y-1 text-lg border-2 border-amber-400"
            >
              <ArrowRight className="w-5 h-5" />
              Apply Sekarang
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 border-2 border-amber-500 text-amber-400 font-semibold py-4 px-10 rounded-xl hover:bg-amber-500 hover:text-black transition-all duration-200 backdrop-blur-sm text-lg"
            >
              <Settings className="w-5 h-5" />
              HR Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Requirements Modal */}
      {isModalOpen && selectedPosition && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black p-6 rounded-t-2xl border-b-2 border-amber-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-black/20 rounded-lg">
                    <HardHat className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black">{selectedPosition.title}</h2>
                    <p className="text-gray-800 text-sm font-medium">{selectedPosition.department}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-black/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Position Info */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">
                      Kandidat Dibutuhkan
                    </span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {selectedPosition.needed}
                  </span>
                </div>
              </div>

              {/* Requirements */}
              {(() => {
                const req = formSettings?.requirements;
                
                // Check if requirements exists and has at least one field
                const hasRequirements = req && typeof req === 'object' && (
                  (req.maxAge !== null && req.maxAge !== undefined) ||
                  (req.gender !== null && req.gender !== undefined) ||
                  (req.minWeight !== null && req.minWeight !== undefined) ||
                  (req.maxWeight !== null && req.maxWeight !== undefined) ||
                  (req.minHeight !== null && req.minHeight !== undefined) ||
                  (req.maxHeight !== null && req.maxHeight !== undefined) ||
                  (req.workExperience !== null && req.workExperience !== undefined)
                );
                
                if (!hasRequirements || !req) {
                  return (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">
                        Tidak ada persyaratan khusus untuk posisi ini
                      </p>
                      {process.env.NODE_ENV === 'development' && (
                        <p className="text-xs text-gray-400 mt-2">
                          Debug: requirements = {JSON.stringify(req)}
                        </p>
                      )}
                    </div>
                  );
                }
                
                return (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <UserCheck className="w-5 h-5 text-amber-600" />
                      <span>Persyaratan Kandidat</span>
                    </h3>
                    
                    <div className="space-y-4">
                    {req.maxAge && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Usia Maksimal</p>
                          <p className="font-semibold text-gray-900">
                            {req.maxAge} tahun
                          </p>
                        </div>
                      </div>
                    )}

                    {req.gender && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <UserCheck className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Jenis Kelamin</p>
                          <p className="font-semibold text-gray-900">
                            {req.gender}
                          </p>
                        </div>
                      </div>
                    )}

                    {(req.minWeight || req.maxWeight) && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Scale className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Berat Badan</p>
                          <p className="font-semibold text-gray-900">
                            {req.minWeight
                              ? `${req.minWeight}`
                              : ""}
                            {req.minWeight &&
                            req.maxWeight
                              ? " - "
                              : ""}
                            {req.maxWeight
                              ? `${req.maxWeight}`
                              : ""}
                            {" kg"}
                          </p>
                        </div>
                      </div>
                    )}

                    {(req.minHeight || req.maxHeight) && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Ruler className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Tinggi Badan</p>
                          <p className="font-semibold text-gray-900">
                            {req.minHeight
                              ? `${req.minHeight}`
                              : ""}
                            {req.minHeight &&
                            req.maxHeight
                              ? " - "
                              : ""}
                            {req.maxHeight
                              ? `${req.maxHeight}`
                              : ""}
                            {" cm"}
                          </p>
                        </div>
                      </div>
                    )}

                    {req.workExperience && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <BriefcaseBusiness className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Pengalaman Kerja</p>
                          <p className="font-semibold text-gray-900">
                            {req.workExperience}
                          </p>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                );
              })()}

              {/* Apply Button */}
              <div className="pt-4 border-t border-gray-200">
                <a
                  href="/recruitment-form"
                  onClick={closeModal}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-amber-400"
                >
                  <HardHat className="w-5 h-5" />
                  Lamar Posisi Ini
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
