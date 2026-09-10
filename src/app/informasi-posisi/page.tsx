"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Shield,
  Wrench,
  Factory,
  Truck,
  Heart,
  HardHat,
  UserCheck,
  Loader2,
  Lock,
  X,
  Calendar,
  Ruler,
  Scale,
  BriefcaseBusiness,
  Sparkles,
  Award,
  ChevronRight,
  Info,
  ExternalLink,
  MapPin,
  Flame,
  CheckCircle2,
  GraduationCap,
  FileBadge,
} from "lucide-react";
import {
  FormSettingsService,
  FormSettings,
} from "@/services/form-settings.service";
import { Position } from "@/types/types";

export interface MajorPositionProfile {
  id: string;
  title: string;
  roleBadge: string;
  department: string;
  category: "hauling" | "plant" | "admin" | "leadership";
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  keyCertifications: string[];
  education: string;
  experienceLevel: string;
  relatedPositions: string[];
  relatedPositionCodes: string[];
}

interface RecruitmentStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
}

// Garis besar posisi utama sesuai kebutuhan PT Batara Dharma Persada
const MAJOR_POSITION_PROFILES: MajorPositionProfile[] = [
  {
    id: "driver-double-trailer",
    title: "Driver Double Trailer",
    roleBadge: "Operasional Hauling",
    department: "Hauling & Logistics Department",
    category: "hauling",
    summary:
      "Mengoperasikan armada angkut batubara rangkaian ganda (Double Trailer / DT) untuk memindahkan batubara dari pit tambang menuju stockpile coalpad dan jetty pelabuhan dengan kepatuhan tinggi terhadap standar keselamatan lalu lintas jalan tambang.",
    responsibilities: [
      "Melakukan pemeriksaan harian pra-operasi kendaraan (P2H / Pre-start check) secara menyeluruh sebelum beroperasi.",
      "Mengemudikan unit hauling rangkaian ganda secara defensif serta mematuhi batas kecepatan dan rambu jalan tambang.",
      "Memastikan proses pemuatan (loading) dan penumpahan (dumping) batubara berjalan aman dan tertib.",
      "Melaporkan segera anomali teknis pada kendaraan atau kondisi jalan hauling kepada pengawas shift.",
    ],
    qualifications: [
      "Wajib memiliki SIM B2 Umum yang sah, aktif, dan masih berlaku.",
      "Pengalaman kerja minimal 2 - 3 tahun mengemudikan truk trailer / double trailer di industri pertambangan batubara.",
      "Memiliki sertifikat Defensive Driving Course (DDC) serta rekam jejak berkendara aman (Zero Accident).",
      "Kebugaran fisik prima, ketajaman visual baik (tidak buta warna), dan siap bekerja dengan sistem giliran shift di remote site.",
    ],
    keyCertifications: ["SIM B2 Umum", "Defensive Driving Course (DDC)", "Surat Bebas Narkoba"],
    education: "Minimal SMA / SMK / Sederajat",
    experienceLevel: "2 - 3 Tahun Pengalaman",
    relatedPositions: [
      "Driver Double Trailer",
      "Driver Sarana Tambang",
      "Driver Light Vehicle (LV)",
      "Trainer Double Trailer",
    ],
    relatedPositionCodes: [
      "DRIVER_DOUBLE_TRAILER",
      "TRAINER_DOUBLE_TRAILER",
      "DRIVER_SARANA",
      "DRIVER_LV",
    ],
  },
  {
    id: "mekanik",
    title: "Mekanik (Heavy Equipment & Plant)",
    roleBadge: "Teknik & Perawatan Alat Berat",
    department: "Plant & Maintenance Department",
    category: "plant",
    summary:
      "Melaksanakan perawatan preventif berkala, servis rutin, inspeksi teknis, dan perbaikan (troubleshooting) mesin armada alat berat pertambangan (Excavator, Bulldozer, Wheel Loader, Dump Truck) guna menjamin kesiapan fisik operasional (PA) unit tetap optimal.",
    responsibilities: [
      "Melaksanakan periodic maintenance, penggantian komponen aus, dan servis berkala unit alat berat tambang.",
      "Mendiagnosis gangguan mesin (engine), sistem hidrolik, transmisi, dan kelistrikan alat berat.",
      "Mengikuti prosedur keselamatan kerja workshop tambang (LOTO, izin kerja, APD standar) serta pemeliharaan 5R.",
      "Melakukan pencatatan riwayat servis dan kebutuhan penggantian suku cadang (spare parts) pada work order.",
    ],
    qualifications: [
      "Pendidikan minimal SMK Otomotif / Teknik Mesin / Alat Berat atau D3/S1 Teknik Mesin.",
      "Pengalaman kerja minimal 2 - 5 tahun sebagai Mekanik Alat Berat di industri pertambangan batubara.",
      "Mampu membaca shop manual, part catalogue, serta skema hidrolik dan kelistrikan unit.",
      "Memiliki komitmen tinggi terhadap standar keselamatan kerja dan siap ditempatkan di workshop remote site.",
    ],
    keyCertifications: [
      "Sertifikasi Alat Berat (Komatsu/Caterpillar/Volvo)",
      "Sertifikat Las & Fabrikasi",
      "K3 Workshop",
    ],
    education: "SMK Teknik / D3 Teknik Mesin / Otomotif",
    experienceLevel: "2 - 5 Tahun (Junior & Senior)",
    relatedPositions: [
      "Mekanik Senior",
      "Mekanik Junior",
      "Mekanik Instructor",
      "Welder & Fabrikasi",
      "Electrician Alat Berat",
      "Tyreman & Plant Support",
    ],
    relatedPositionCodes: [
      "MECHANIC_SR",
      "MECHANIC_JR",
      "TRAINER_MECHANIC",
      "MECHANIC_INSTRUCTOR",
      "ELECTRICIAN",
      "WELDER",
      "TYREMAN",
      "FABRICATION",
      "TOOLKEEPER",
    ],
  },
  {
    id: "mekanik-bmc",
    title: "Mekanik BMC (Basic Mechanic Course)",
    roleBadge: "Program Pembinaan Talenta Baru",
    department: "Plant & Workshop Development",
    category: "plant",
    summary:
      "Program akselerasi dan pelatihan kejuruan teknisi alat berat pemula (Basic Mechanic Course) untuk lulusan baru (fresh graduate) dalam mempersiapkan tenaga mekanik handal berstandar industri pertambangan nasional.",
    responsibilities: [
      "Mengikuti rangkaian pelatihan teori teknis dan on-the-job training (OJT) perawatan alat berat secara intensif.",
      "Mendampingi mekanik senior dalam pelaksanaan servis berkala, pelumasan, dan penggantian filter unit.",
      "Mempelajari dasar-dasar komponen engine, hidrolik, sistem pendingin, dan kelistrikan alat berat tambang.",
      "Menerapkan budaya keselamatan kerja dasar, disiplin kerja workshop, serta pemeliharaan perkakas kerja (tools).",
    ],
    qualifications: [
      "Lulusan baru (Fresh Graduate) SMK Teknik Otomotif, Teknik Alat Berat, Mesin, Listrik, atau D3 Teknik.",
      "Usia maksimal 23 - 25 tahun dengan motivasi belajar dan determinasi kerja yang tinggi di remote area.",
      "Memiliki pemahaman dasar mengenai cara kerja mesin pembakaran dalam dan perkakas tangan mekanik.",
      "Kebugaran jasmani dan rohani prima, bebas tato/tindik yang melanggar standar, serta lulus pemeriksaan kesehatan (MCU).",
    ],
    keyCertifications: [
      "Sertifikat Pelatihan BMC (nilai tambah)",
      "Ijazah SMK/D3 Teknik Terakreditasi",
      "Surat Keterangan Sehat MCU",
    ],
    education: "Fresh Graduate SMK Teknik / D3 Teknik",
    experienceLevel: "Fresh Graduate / Entry Level",
    relatedPositions: [
      "Mekanik Fresh BMC",
      "Mekanik Magang",
      "Plant Apprentice",
    ],
    relatedPositionCodes: [
      "MECHANIC_FRESH_BMC",
      "MECHANIC_MAGANG",
    ],
  },
  {
    id: "admin",
    title: "Admin (Administrasi Proyek & Operasional)",
    roleBadge: "Dukungan Data & Operasional",
    department: "HRGA, Plant, Logistik, CCR & Penimbangan",
    category: "admin",
    summary:
      "Mengelola administrasi data operasional, pencatatan produksi dan ritase armada (CCR & Jembatan Timbang), data inventaris gudang suku cadang, administrasi kepegawaian site (mess, tiket, absensi), serta penyusunan laporan kerja periodik secara akurat.",
    responsibilities: [
      "Melakukan input dan verifikasi data transaksi operasional harian ke dalam sistem basis data perusahaan.",
      "Mengelola pencatatan tonase jembatan timbang batubara dan surat jalan hauling secara tertib dan akurat.",
      "Menyusun laporan harian (Daily Report), mingguan, dan bulanan untuk pimpinan departemen.",
      "Mendukung koordinasi akomodasi mess, kebutuhan logistik perkantoran, dan pelayanan personil site.",
    ],
    qualifications: [
      "Pendidikan minimal SMA / SMK / D3 / S1 Manajemen, Akuntansi, Administrasi Bisnis, IT, atau bidang terkait.",
      "Mahir mengoperasikan komputer, khususnya Microsoft Excel (fungsi vlookup, pivot table, sumif) dan Microsoft Word.",
      "Memiliki ketelitian tinggi, detail-oriented, dan mampu bekerja dengan ritme data yang dinamis.",
      "Memiliki kemampuan komunikasi yang santun, koordinasi tim yang baik, dan integritas kerja tinggi.",
    ],
    keyCertifications: [
      "Sertifikasi Microsoft Office (Nilai Tambah)",
      "Kemahiran Sistem Database / ERP",
    ],
    education: "SMA/SMK / D3 / S1 Semua Jurusan",
    experienceLevel: "Fresh Graduate / 1 - 2 Tahun Pengalaman",
    relatedPositions: [
      "Admin CCR (Central Control Room)",
      "Admin Jembatan Timbang (Weight Bridge)",
      "Admin Plant & Maintenance",
      "Admin Tyre & Logistik",
      "Admin HRGA & Camp Service",
      "Admin HSE",
    ],
    relatedPositionCodes: [
      "CCR_ADMIN",
      "WEIGHT_BRIDGE_ADMIN",
      "PLANT_ADMIN",
      "TYRE_ADMIN",
      "LOGISTIC_ADMIN",
      "HRGA_ADMIN",
      "HSE_ADMIN",
      "TOOLKEEPER",
    ],
  },
  {
    id: "supervisor",
    title: "Supervisor (SPV Lapangan & Teknis)",
    roleBadge: "Kepemimpinan & Pengawasan Operasional",
    department: "Produksi, Plant, Logistik, HSE & HRGA",
    category: "leadership",
    summary:
      "Memimpin, mengarahkan, dan mengawasi pelaksanaan aktivitas operasional harian di pit, workshop, jalan hauling, atau area penunjang tambang guna memastikan ketercapaian target produksi dengan standar keselamatan kerja (K3LH) tanpa kompromi.",
    responsibilities: [
      "Memimpin briefing keselamatan kerja harian (Safety Talk / P5M) sebelum pergantian shift operasional.",
      "Membagi tugas kerja harian kepada Group Leader dan operator serta mengawasi kelancaran aktivitas lapangan.",
      "Melakukan inspeksi rutin terhadap kepatuhan SOP kerja, kondisi jalan tambang, dan keselamatan area operasional.",
      "Menyusun evaluasi pencapaian target shift, laporan produksi, dan penyelesaian kendala teknis lapangan.",
    ],
    qualifications: [
      "Pendidikan minimal D3 / S1 Teknik Pertambangan, Teknik Mesin, Teknik Sipil, K3, atau manajemen terkait.",
      "Pengalaman minimal 3 - 5 tahun di posisi pengawas / supervisor di industri pertambangan batubara.",
      "Diutamakan / Wajib memiliki sertifikat Pengawas Operasional Pertama (POP) dari Kementerian ESDM.",
      "Memiliki jiwa kepemimpinan yang tangguh, pemecahan masalah cepat, dan komunikasi persuasif antar-tim.",
    ],
    keyCertifications: [
      "Sertifikasi POP (Pengawas Operasional Pertama)",
      "Sertifikat K3 Pertambangan",
      "SIM A / B Aktif",
    ],
    education: "D3 / S1 Teknik atau Bidang Terkait",
    experienceLevel: "Minimal 3 - 5 Tahun Pengalaman",
    relatedPositions: [
      "Supervisor Produksi",
      "Supervisor Plant",
      "Supervisor Logistik & Hauling",
      "Supervisor HSE & Keselamatan",
      "Supervisor HRGA",
      "Supervisor Purchasing",
      "Group Leader Operasional / Plant",
    ],
    relatedPositionCodes: [
      "PROD_ENG_SPV",
      "PLAN_SPV",
      "LOGISTIC_SPV",
      "HSE_SPV",
      "HRGA_SPV",
      "PURCHASING_SPV",
      "PRODUCTION_GROUP_LEADER",
      "PLANT_GROUP_LEADER",
      "TYRE_GROUP_LEADER",
      "LOGISTIC_GROUP_LEADER",
      "HR_GROUP_LEADER",
      "GA_GROUP_LEADER",
      "MOCO_LEADER",
    ],
  },
  {
    id: "superintendent",
    title: "Superintendent",
    roleBadge: "Pimpinan Operasional & Manajemen Site",
    department: "Production, Plant, Logistic, HSE & HRGA",
    category: "leadership",
    summary:
      "Memegang kendali strategis operasional di tingkat site, merancang program kerja dan anggaran biaya (budgeting), memimpin seluruh jajaran Supervisor dan pengawas lapangan, serta menjamin pencapaian target KPI operasional PT Batara Dharma Persada.",
    responsibilities: [
      "Merumuskan perencanaan strategis operasional, target produksi/ketersediaan armada, dan alokasi sumber daya site.",
      "Mengendalikan efisiensi biaya operasional (cost management) dan optimalisasi utilisasi seluruh unit kerja tambang.",
      "Menjalin koordinasi harmonis dengan manajemen pemilik tambang (owner), mitra kerja, dan instansi regulator.",
      "Membina, mengevaluasi kinerja jajaran Supervisor, serta memastikan kepatuhan menyeluruh terhadap regulasi pertambangan.",
    ],
    qualifications: [
      "Pendidikan minimal S1 Teknik Pertambangan, Geologi, Teknik Mesin, atau Manajemen Bisnis/Teknik Industri.",
      "Pengalaman minimal 7 - 10 tahun di industri pertambangan batubara, dengan minimal 3 tahun pada level manajerial.",
      "Wajib memiliki sertifikat Pengawas Operasional Madya (POM) atau Pengawas Operasional Utama (POU).",
      "Memiliki visi kepemimpinan strategis, kemampuan negosiasi tinggi, dan pemahaman mendalam tentang bisnis pertambangan.",
    ],
    keyCertifications: [
      "Sertifikasi POM (Pengawas Operasional Madya)",
      "Sertifikasi POU (Pengawas Operasional Utama)",
      "Sistem Manajemen Keselamatan Pertambangan (SMKP)",
    ],
    education: "S1 / S2 Teknik Pertambangan / Mesin / Manajemen",
    experienceLevel: "Minimal 7 - 10 Tahun Pengalaman",
    relatedPositions: [
      "Superintendent Production Engineering",
      "Superintendent Plant & Logistic",
      "Superintendent HRGA",
      "Superintendent HSE",
      "Superintendent Procurement",
      "Project Manager & Deputy PM",
    ],
    relatedPositionCodes: [
      "DEPT_HEAD_PRODUCTION_ENGINEERING",
      "DEPT_HEAD_PLANT_LOGISTIC",
      "DEPT_HEAD_HRGA",
      "DEPT_HEAD_HSE",
      "MANAGER_PROCUREMENT",
      "PROJECT_MANAGER",
      "DEPUTY_PM",
    ],
  },
];

const categoryMeta = {
  all: {
    label: "Semua Garis Besar",
    icon: <Briefcase className="w-4 h-4" />,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  hauling: {
    label: "Driver & Hauling",
    icon: <Truck className="w-4 h-4" />,
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
  },
  plant: {
    label: "Mekanik & BMC",
    icon: <Wrench className="w-4 h-4" />,
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
  },
  admin: {
    label: "Administrasi",
    icon: <FileBadge className="w-4 h-4" />,
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
  },
  leadership: {
    label: "Supervisor & Superintendent",
    icon: <HardHat className="w-4 h-4" />,
    badgeColor: "bg-amber-50 text-amber-900 border-amber-200",
  },
};

const recruitmentSteps: RecruitmentStep[] = [
  {
    step: 1,
    title: "Aplikasi Online",
    description: "Pengisian form digital & unggah dokumen pendukung secara mandiri.",
    duration: "1 Hari",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    step: 2,
    title: "Screening Administrasi",
    description: "Verifikasi kualifikasi, pengalaman, dan kelengkapan berkas lamaran.",
    duration: "2 - 4 Hari",
    icon: <Users className="w-5 h-5" />,
  },
  {
    step: 3,
    title: "Interview HR",
    description: "Wawancara kompetensi dasar, kepribadian, dan komitmen penempatan kerja.",
    duration: "1 - 2 Hari",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    step: 4,
    title: "Psikotes Online",
    description: "Evaluasi kemampuan kognitif, ketahanan kerja, dan karakter profesional.",
    duration: "1 Hari",
    icon: <Award className="w-5 h-5" />,
  },
  {
    step: 5,
    title: "Interview User / Teknis",
    description: "Pendalaman skill teknis dan kesiapan operasional bersama Superintendent atau Supervisor terkait.",
    duration: "1 - 2 Hari",
    icon: <HardHat className="w-5 h-5" />,
  },
  {
    step: 6,
    title: "Medical Check-Up (MCU)",
    description: "Pemeriksaan kesehatan fisik menyeluruh di klinik rekanan resmi.",
    duration: "1 - 3 Hari",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    step: 7,
    title: "Offering & Onboarding",
    description: "Penandatanganan kontrak kerja, briefing keselamatan (K3), dan penempatan.",
    duration: "2 - 3 Hari",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

export default function InformasiPosisi() {
  const [formSettings, setFormSettings] = useState<FormSettings | null>(null);
  const [selectedProfile, setSelectedProfile] =
    useState<MajorPositionProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "hauling" | "plant" | "admin" | "leadership"
  >("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsResponse = await FormSettingsService.getFormSettings().catch(
          () => null
        );
        if (settingsResponse?.formSettings) {
          setFormSettings(settingsResponse.formSettings);
        }
      } catch (error) {
        console.error("Error fetching form settings:", error);
      }
    };

    fetchData();
  }, []);

  const isFormOpen = Boolean(formSettings?.isFormOpen);
  const openPositions = formSettings?.openPositions || [];

  // Determine if a profile is currently accepting applications
  const checkProfileOpen = (profile: MajorPositionProfile): boolean => {
    if (!isFormOpen) return false;
    if (openPositions.length === 0) return true;
    return profile.relatedPositionCodes.some((code) =>
      openPositions.includes(code as Position)
    );
  };

  // Filtered Profiles based on Category and Search Query
  const filteredProfiles = useMemo(() => {
    return MAJOR_POSITION_PROFILES.filter((profile) => {
      // Category Filter
      if (selectedCategory !== "all" && profile.category !== selectedCategory) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = profile.title.toLowerCase().includes(q);
        const matchDept = profile.department.toLowerCase().includes(q);
        const matchSummary = profile.summary.toLowerCase().includes(q);
        const matchRelated = profile.relatedPositions.some((p) =>
          p.toLowerCase().includes(q)
        );
        const matchCerts = profile.keyCertifications.some((c) =>
          c.toLowerCase().includes(q)
        );

        if (
          !matchTitle &&
          !matchDept &&
          !matchSummary &&
          !matchRelated &&
          !matchCerts
        ) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleCardClick = (profile: MajorPositionProfile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <img
            src="/mining-bg.jpg"
            alt="Operasional Tambang Batubara PT Batara Dharma Persada"
            className="w-full h-full object-cover object-center"
          />
          {/* Light gradient wash: preserves clarity of the mine while softly fading into white */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/10 to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/40 sm:bg-white/45 backdrop-blur-md border border-white/60 shadow-2xl rounded-3xl p-6 sm:p-10 md:p-12 text-center space-y-6">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                {isFormOpen ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                )}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                {isFormOpen ? (
                  <span className="text-emerald-700 font-bold">
                    Rekrutmen Dibuka &bull; Menerima Lamaran
                  </span>
                ) : (
                  <span className="text-amber-800 font-bold">
                    Katalog Formasi Posisi Resmi
                  </span>
                )}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <div className="text-teal-700 font-extrabold tracking-wider text-xs sm:text-sm uppercase">
                PT Batara Dharma Persada
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight sm:whitespace-nowrap">
                Garis Besar Posisi &{" "}
                <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                  Peluang Karir
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto pt-1">
                Informasi formasi utama karir di <strong className="text-slate-950 font-bold">PT Batara Dharma Persada</strong>. Temukan ringkasan peran, kualifikasi, dan jalur karir strategis pertambangan batubara.
              </p>
            </div>


            {/* Due date notice if configured */}
            {formSettings?.dueDate && isFormOpen && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-medium">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Batas Akhir Pendaftaran:</span>
                <strong className="text-slate-900">
                  {new Date(formSettings.dueDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recruitment Status Banner (Enlarged and Prominent Status Announcement) */}
      <section
        className={`relative overflow-hidden border-y py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 shadow-xs ${
          !isFormOpen
            ? "bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 border-amber-300"
            : "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-teal-300"
        }`}
      >
        <div
          className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[36rem] h-56 rounded-full blur-3xl pointer-events-none ${
            !isFormOpen ? "bg-amber-200/50" : "bg-teal-200/50"
          }`}
        ></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-sm ${
                !isFormOpen
                  ? "bg-amber-100 border-amber-300 text-amber-800 shadow-amber-500/10"
                  : "bg-teal-100 border-teal-300 text-teal-800 shadow-teal-500/10"
              }`}
            >
              {!isFormOpen ? (
                <Info className="w-8 h-8 sm:w-10 sm:h-10" />
              ) : (
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
              )}
            </div>

            <div className="space-y-3.5 max-w-3xl">
              <div
                className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xs ${
                  !isFormOpen
                    ? "bg-amber-100/90 border-amber-300 text-amber-900"
                    : "bg-emerald-100/90 border-emerald-300 text-emerald-900"
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      !isFormOpen ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      !isFormOpen ? "bg-amber-600" : "bg-emerald-600"
                    }`}
                  ></span>
                </span>
                Informasi Status Pendaftaran
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight">
                {!isFormOpen
                  ? "Periode Pendaftaran Saat Ini Sedang Ditutup"
                  : "Periode Pendaftaran Batch Resmi Sedang Dibuka"}
              </h2>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {!isFormOpen
                  ? formSettings?.reason
                    ? formSettings.reason
                    : "Formulir pendaftaran sedang dinonaktifkan sementara untuk proses seleksi berkas. Anda tetap dapat membaca kualifikasi posisi di bawah untuk persiapan pembukaan batch berikutnya."
                  : "Formulir pendaftaran daring resmi menerima berkas pelamar. Silakan pilih formasi posisi yang sesuai dengan kualifikasi Anda dan ajukan lamaran sebelum batas waktu berakhir."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto flex-shrink-0">
            {!isFormOpen ? (
              <>
                <Link
                  href="/tracking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-md shadow-teal-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Lacak Status Lamaran</span>
                </Link>
                <Link
                  href="/support"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-sm sm:text-base border border-slate-300 shadow-xs transition-colors"
                >
                  <span>Pusat Bantuan HR</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/recruitment-form"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-md shadow-teal-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Isi Formulir Pendaftaran</span>
                </Link>
                <Link
                  href="/tracking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-sm sm:text-base border border-slate-300 shadow-xs transition-colors"
                >
                  <span>Lacak Lamaran</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content: Garis Besar Formasi Posisi */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {/* Search & Filter Header */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari formasi utama (Driver, Mekanik, BMC, Admin, Supervisor, Superintendent)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-600 font-medium">
              Menampilkan{" "}
              <span className="text-teal-700 font-bold">
                {filteredProfiles.length}
              </span>{" "}
              Garis Besar Posisi
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {(Object.keys(categoryMeta) as (keyof typeof categoryMeta)[]).map(
              (cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-xs"
                    }`}
                  >
                    <span>{categoryMeta[cat].icon}</span>
                    <span>{categoryMeta[cat].label}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => {
            const isOpen = checkProfileOpen(profile);

            return (
              <div
                key={profile.id}
                onClick={() => handleCardClick(profile)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {profile.roleBadge}
                    </span>

                    {isOpen ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Menerima Lamaran</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                        Katalog Profil
                      </span>
                    )}
                  </div>

                  {/* Profile Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug mb-1">
                    {profile.title}
                  </h3>

                  {/* Department */}
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                    <Briefcase className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span>{profile.department}</span>
                  </p>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {profile.summary}
                  </p>

                  {/* Key Certifications / Highlights */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Kualifikasi Kunci:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.keyCertifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Related Positions Preview */}
                  <div className="pt-2 border-t border-slate-100 mb-4">
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Mencakup Formasi:
                    </span>
                    <div className="text-xs text-slate-700 font-medium line-clamp-1">
                      {profile.relatedPositions.join(", ")}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-teal-700 group-hover:text-teal-800 font-bold flex items-center gap-1">
                    <span>Lihat Detail Kualifikasi</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>

                  {isOpen ? (
                    <span className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors shadow-xs">
                      Lamar Posisi
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px] font-medium">
                      Kualifikasi Lengkap
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recruitment Process Stepper Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-t border-b border-slate-300 px-4 sm:px-6 lg:px-8">
        {/* Background Corporate Architectural Image with Balanced Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/selection-pathway.jpg"
            alt="Alur Seleksi Karir PT Batara Dharma Persada"
            className="w-full h-full object-cover object-center"
          />
          {/* Moderately darkened overlay so the architectural depth shows clearly and eliminates blinding white */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/55 to-slate-950/70"></div>
        </div>

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              Proses Seleksi Terstruktur
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Alur Tahapan Seleksi Rekrutmen
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-medium max-w-2xl mx-auto">
              Proses seleksi terstruktur dan transparan tanpa dipungut biaya apapun dari kandidat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recruitmentSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-5 relative flex flex-col justify-between hover:border-teal-500 hover:shadow-2xl transition-all shadow-xl group hover:-translate-y-1 border border-slate-100"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold shadow-xs">
                      {step.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg font-mono">
                      Tahap 0{step.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-teal-800 font-bold">
                  <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                  <span>Estimasi: {step.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Fraud Warning Alert */}
          <div className="p-4 rounded-xl bg-white/95 backdrop-blur-md border border-amber-300 flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left max-w-4xl mx-auto shadow-xl">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-900 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong className="text-amber-950 font-extrabold block sm:inline mr-1">
                Peringatan Bebas Pungutan Biaya:
              </strong>
              PT Batara Dharma Persada tidak pernah memungut biaya apapun dalam seluruh tahapan seleksi rekrutmen. Waspadai segala bentuk penipuan yang mengatasnamakan perusahaan.
            </div>
          </div>
        </div>
      </section>


      {/* Modal Detail Kualifikasi Garis Besar */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {selectedProfile.roleBadge}
                  </span>

                  {checkProfileOpen(selectedProfile) ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                      Lowongan Dibuka
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                      Katalog Profil Karir
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {selectedProfile.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {selectedProfile.department}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-sm text-slate-700 bg-white">
              {/* Profile Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">
                    Tingkat Pendidikan
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {selectedProfile.education}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">
                    Pengalaman Kerja
                  </span>
                  <span className="text-xs font-bold text-teal-700">
                    {selectedProfile.experienceLevel}
                  </span>
                </div>
              </div>

              {/* Scope & Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                  <span>Ruang Lingkup & Ringkasan Peran</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedProfile.summary}
                </p>
              </div>

              {/* Tanggung Jawab Utama */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tanggung Jawab Utama:
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedProfile.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0"></span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kualifikasi Utama */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Persyaratan & Kualifikasi Utama:
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedProfile.qualifications.map((qual, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formasi Posisi Terkait */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Formasi Jabatan Terkait dalam Jalur Ini:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfile.relatedPositions.map((pos, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>

              {/* Persyaratan Dinamis dari Pengaturan Form (Jika Ada) */}
              {formSettings?.requirements && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Kriteria Administratif Periode Pendaftaran:</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {formSettings.requirements.maxAge && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <div>
                          <span className="text-slate-500 block text-[10px]">
                            Usia Maksimal
                          </span>
                          <span className="font-bold text-slate-900">
                            {formSettings.requirements.maxAge} Tahun
                          </span>
                        </div>
                      </div>
                    )}

                    {formSettings.requirements.gender && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <UserCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <div>
                          <span className="text-slate-500 block text-[10px]">
                            Jenis Kelamin
                          </span>
                          <span className="font-bold text-slate-900">
                            {formSettings.requirements.gender}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs border border-slate-300 transition-colors shadow-xs"
              >
                Tutup
              </button>

              {checkProfileOpen(selectedProfile) ? (
                <Link
                  href="/recruitment-form"
                  onClick={closeModal}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all"
                >
                  <HardHat className="w-4 h-4" />
                  <span>Ajukan Lamaran Pada Posisi Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/tracking"
                  onClick={closeModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Lacak Status Lamaran</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
