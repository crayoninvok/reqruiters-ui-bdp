"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  User,
  Briefcase,
  RefreshCw,
  ArrowLeft,
  Home,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Award,
  HardHat,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { PublicRecruitmentService } from "@/services/public-recruitment.service";

interface ApplicationStatus {
  id: string;
  applicantName: string;
  position: string;
  status: string;
  submittedAt: string;
  lastUpdated: string;
}

interface MilestoneStage {
  key: string;
  label: string;
  shortDesc: string;
  stageIndex: number;
}

const RECRUITMENT_MILESTONES: MilestoneStage[] = [
  {
    key: "PENDING",
    label: "Aplikasi Terdaftar",
    shortDesc: "Berkas masuk & registrasi",
    stageIndex: 0,
  },
  {
    key: "ON_PROGRESS",
    label: "Screening Berkas",
    shortDesc: "Evaluasi CV & dokumen",
    stageIndex: 1,
  },
  {
    key: "INTERVIEW",
    label: "Interview HR",
    shortDesc: "Wawancara kompetensi dasar",
    stageIndex: 2,
  },
  {
    key: "PSIKOTEST",
    label: "Psikotes Online",
    shortDesc: "Uji kognitif & kepribadian",
    stageIndex: 3,
  },
  {
    key: "USER_INTERVIEW",
    label: "Interview Teknis",
    shortDesc: "Wawancara user departemen",
    stageIndex: 4,
  },
  {
    key: "MEDICAL_CHECKUP",
    label: "Medical Check-Up",
    shortDesc: "Pemeriksaan kesehatan fisik",
    stageIndex: 5,
  },
  {
    key: "HIRED",
    label: "Keputusan Final",
    shortDesc: "Offering & onboarding",
    stageIndex: 6,
  },
];

const getStageIndex = (status: string): number => {
  switch (status) {
    case "PENDING":
      return 0;
    case "ON_PROGRESS":
      return 1;
    case "INTERVIEW":
      return 2;
    case "PSIKOTEST":
      return 3;
    case "USER_INTERVIEW":
      return 4;
    case "MEDICAL_CHECKUP":
    case "MEDICAL_FOLLOWUP":
      return 5;
    case "COMPLETED":
    case "HIRED":
      return 6;
    case "REJECTED":
      return -1;
    default:
      return 0;
  }
};

function TrackingContent() {
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState("");
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Auto-search if id query param exists in URL
  useEffect(() => {
    const idFromQuery = searchParams.get("id");
    if (idFromQuery && idFromQuery.trim()) {
      setApplicationId(idFromQuery.trim());
      executeSearch(idFromQuery.trim());
    }
  }, [searchParams]);

  const executeSearch = async (targetId: string) => {
    const id = targetId.trim();
    if (!id) {
      Swal.fire({
        icon: "warning",
        title: "ID Aplikasi Diperlukan",
        text: "Silakan masukkan ID aplikasi pelamar yang Anda peroleh saat submit formulir.",
        confirmButtonColor: "#0d9488",
        background: "#ffffff",
        color: "#0f172a",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setApplicationStatus(null);

    try {
      const response = await PublicRecruitmentService.checkApplicationStatus(id);
      setApplicationStatus(response.application);
      setIsSearched(true);

      Swal.fire({
        icon: "success",
        title: "Status Ditemukan",
        text: `Data lamaran untuk ${response.application.applicantName} berhasil dimuat.`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: "#ffffff",
        color: "#0f172a",
      });
    } catch (err: any) {
      const errorMessage = PublicRecruitmentService.formatErrorMessage(err);
      setError(errorMessage);
      setIsSearched(true);

      if (err.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Aplikasi Tidak Ditemukan",
          text: "ID aplikasi tidak terdaftar di sistem rekrutmen PT Batara Dharma Persada. Pastikan Anda memasukkan ID secara lengkap dan benar.",
          confirmButtonColor: "#0d9488",
          background: "#ffffff",
          color: "#0f172a",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengambil Data",
          text: errorMessage || "Terjadi kendala jaringan saat mencari data.",
          confirmButtonColor: "#0d9488",
          background: "#ffffff",
          color: "#0f172a",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    executeSearch(applicationId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeSearch(applicationId);
    }
  };

  const resetSearch = () => {
    setApplicationId("");
    setApplicationStatus(null);
    setIsSearched(false);
    setError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Format position title
  const formatPosition = (pos: string) => {
    return pos
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/\bSpv\b/g, "Supervisor")
      .replace(/\bHse\b/g, "HSE")
      .replace(/\bHrga\b/g, "HRGA")
      .replace(/\bHr\b/g, "HR")
      .replace(/\bGa\b/g, "GA")
      .replace(/\bCcr\b/g, "CCR")
      .replace(/\bDt\b/g, "DT")
      .replace(/\bErt\b/g, "ERT")
      .replace(/\bB3\b/g, "B3")
      .replace(/\bK3\b/g, "K3")
      .replace(/\bDept Head\b/g, "Superintendent");
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Status Presentation configuration
  const getStatusBadgeConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Menunggu Review",
          color: "bg-amber-50/90 text-slate-800 border-amber-300",
          iconBg: "bg-amber-100 border border-amber-200 text-amber-800",
          icon: <Clock className="w-5 h-5 text-amber-700" />,
          desc: "Aplikasi dan berkas Anda telah tersimpan dan sedang menunggu antrean peninjauan oleh tim HR Rekrutmen PT Batara Dharma Persada.",
        };
      case "ON_PROGRESS":
        return {
          label: "Sedang Diproses (Screening)",
          color: "bg-blue-50/90 text-slate-800 border-blue-300",
          iconBg: "bg-blue-100 border border-blue-200 text-blue-800",
          icon: <RefreshCw className="w-5 h-5 text-blue-700 animate-spin" />,
          desc: "Tim HR sedang mengevaluasi kelengkapan dokumen pendukung, kesesuaian kualifikasi, dan rekam jejak pengalaman kerja Anda.",
        };
      case "INTERVIEW":
        return {
          label: "Tahap Interview HR",
          color: "bg-teal-50/90 text-slate-800 border-teal-300",
          iconBg: "bg-teal-100 border border-teal-200 text-teal-800",
          icon: <User className="w-5 h-5 text-teal-700" />,
          desc: "Selamat! Anda lolos seleksi administrasi awal. Tim HR akan segera menghubungi Anda melalui WhatsApp atau email untuk konfirmasi jadwal wawancara.",
        };
      case "PSIKOTEST":
        return {
          label: "Tahap Tes Psikologi (Psikotes)",
          color: "bg-indigo-50/90 text-slate-800 border-indigo-300",
          iconBg: "bg-indigo-100 border border-indigo-200 text-indigo-800",
          icon: <FileText className="w-5 h-5 text-indigo-700" />,
          desc: "Anda dijadwalkan mengikuti evaluasi psikotes online. Mohon periksa email atau pesan WhatsApp secara berkala untuk petunjuk pelaksanaan.",
        };
      case "USER_INTERVIEW":
        return {
          label: "Interview User / Superintendent & Supervisor",
          color: "bg-cyan-50/90 text-slate-800 border-cyan-300",
          iconBg: "bg-cyan-100 border border-cyan-200 text-cyan-800",
          icon: <HardHat className="w-5 h-5 text-cyan-700" />,
          desc: "Anda memasuki tahap wawancara teknis lapangan bersama Superintendent atau Supervisor terkait untuk pendalaman kompetensi kerja.",
        };
      case "MEDICAL_CHECKUP":
      case "MEDICAL_FOLLOWUP":
        return {
          label: "Pemeriksaan Kesehatan (MCU)",
          color: "bg-emerald-50/90 text-slate-800 border-emerald-300",
          iconBg: "bg-emerald-100 border border-emerald-200 text-emerald-800",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
          desc: "Anda dijadwalkan melakukan pemeriksaan kesehatan fisik komprehensif di klinik rekanan resmi PT Batara Dharma Persada.",
        };
      case "HIRED":
      case "COMPLETED":
        return {
          label: "Diterima (Hired)",
          color: "bg-emerald-50 text-slate-800 border-emerald-400",
          iconBg: "bg-emerald-100 border border-emerald-300 text-emerald-800",
          icon: <CheckCircle className="w-5 h-5 text-emerald-700" />,
          desc: "Selamat! Anda dinyatakan lolos seluruh rangkaian proses seleksi dan diterima bergabung sebagai karyawan PT Batara Dharma Persada.",
        };
      case "REJECTED":
        return {
          label: "Belum Memenuhi Kualifikasi",
          color: "bg-rose-50/90 text-slate-800 border-rose-300",
          iconBg: "bg-rose-100 border border-rose-200 text-rose-800",
          icon: <XCircle className="w-5 h-5 text-rose-700" />,
          desc: "Terima kasih atas minat dan partisipasi Anda. Saat ini kualifikasi Anda belum sesuai dengan formasi yang dibutuhkan. Data Anda tetap tersimpan dalam database talenta kami untuk peluang di masa mendatang.",
        };
      default:
        return {
          label: status,
          color: "bg-slate-50 text-slate-800 border-slate-300",
          iconBg: "bg-slate-100 border border-slate-200 text-slate-700",
          icon: <Clock className="w-5 h-5 text-slate-600" />,
          desc: "Aplikasi Anda sedang dalam proses penanganan oleh tim rekrutmen.",
        };
    }
  };

  const currentStageIndex = applicationStatus
    ? getStageIndex(applicationStatus.status)
    : 0;

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200/60 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Ambient Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Pelacakan Status Lamaran Real-Time
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-teal-700 font-extrabold tracking-wider text-xs sm:text-sm uppercase">
              PT Batara Dharma Persada
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:whitespace-nowrap">
              Lacak Status{" "}
              <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                Lamaran Kerja
              </span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pantau perkembangan dan tahapan proses seleksi Anda di{" "}
            <strong className="text-slate-900 font-bold">PT Batara Dharma Persada</strong> secara transparan dengan memasukkan ID aplikasi yang Anda terima.
          </p>
        </div>
      </section>

      {/* Main Search & Results Area with Corporate Background */}
      <section className="relative overflow-hidden flex-1 py-10 lg:py-16">
        {/* Background Corporate Architectural Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/tracking-bg.jpg"
            alt="Latar Belakang Pelacakan Karir PT Batara Dharma Persada"
            className="w-full h-full object-cover object-center"
          />
          {/* Balanced base overlay to retain depth and skyline clarity */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/45 to-slate-950/60"></div>

          {/* Nuansa putih dari atas agar menyambung mulus dari header section */}
          <div className="absolute inset-x-0 top-0 h-48 sm:h-64 bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none"></div>
        </div>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-8">
          {/* Search Box Card */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Nomor ID Aplikasi Anda
            </label>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Contoh: cmei6kixz0000l304q5tbmq7f atau ID 25 karakter"
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors shadow-xs"
                />
              </div>

              <button
                onClick={handleSearchClick}
                disabled={isLoading || !applicationId.trim()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Memeriksa...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Cek Status</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-500">
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                ID aplikasi tertera pada layar sukses registrasi dan bukti pendaftaran.
              </span>

              {isSearched && (
                <button
                  onClick={resetSearch}
                  className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Reset Pencarian</span>
                </button>
              )}
            </div>
          </div>

          {/* Results: Application Found */}
          {applicationStatus && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Status Summary Banner */}
              {(() => {
                const badge = getStatusBadgeConfig(applicationStatus.status);
                return (
                  <div
                    className={`rounded-2xl p-6 border shadow-xl ${badge.color} bg-white/95 backdrop-blur-md`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl shadow-xs ${badge.iconBg}`}>
                          {badge.icon}
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Status Terkini Lamaran
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                            {badge.label}
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs">
                        <span className="text-slate-600 font-mono text-[11px]">
                          ID: {applicationStatus.id.slice(0, 16)}...
                        </span>
                        <button
                          onClick={() => copyToClipboard(applicationStatus.id)}
                          className="text-teal-700 hover:text-teal-800 p-1 rounded"
                          title="Salin ID Lengkap"
                        >
                          {copiedId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="pt-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {badge.desc}
                    </p>
                  </div>
                );
              })()}

              {/* Visual Milestones Stepper (Progress Bar) */}
              {applicationStatus.status !== "REJECTED" && (
                <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Progres Tahapan Seleksi
                      </h3>
                      <p className="text-xs text-slate-500">
                        Pantau posisi Anda pada rangkaian tahapan rekrutmen PT Batara Dharma Persada
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                      Step {Math.min(currentStageIndex + 1, 7)} dari 7
                    </span>
                  </div>

                  {/* Stepper Timeline Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                    {RECRUITMENT_MILESTONES.map((milestone, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const isPending = idx > currentStageIndex;

                      return (
                        <div
                          key={milestone.key}
                          className={`relative rounded-xl p-3 border flex flex-col justify-between transition-all ${
                            isCurrent
                              ? "bg-teal-50/80 border-2 border-teal-500 shadow-md shadow-teal-500/10 text-teal-950"
                              : isCompleted
                              ? "bg-emerald-50/60 border-emerald-300 text-slate-700"
                              : "bg-slate-50 border-slate-200 text-slate-400 opacity-80"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono font-bold text-slate-500">
                                0{idx + 1}
                              </span>
                              {isCompleted && (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                              {isCurrent && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                                </span>
                              )}
                            </div>

                            <h4
                              className={`text-xs font-bold leading-tight mb-1 ${
                                isCurrent
                                  ? "text-teal-900"
                                  : isCompleted
                                  ? "text-slate-900"
                                  : "text-slate-500"
                              }`}
                            >
                              {milestone.label}
                            </h4>
                          </div>

                          <span className="text-[10px] text-slate-500 block mt-2 font-medium">
                            {isCurrent
                              ? "Sedang Berlangsung"
                              : isCompleted
                              ? "Selesai"
                              : "Tahap Mendatang"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Detailed Applicant & Application Information */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Rincian Data Pendaftaran</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        Nama Lengkap Pelamar
                      </span>
                      <strong className="text-sm font-bold text-slate-900">
                        {applicationStatus.applicantName}
                      </strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex-shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        Posisi yang Dilamar
                      </span>
                      <strong className="text-sm font-bold text-slate-900">
                        {formatPosition(applicationStatus.position)}
                      </strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex-shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        Tanggal Pengajuan Berkas
                      </span>
                      <strong className="text-xs font-semibold text-slate-800">
                        {formatDate(applicationStatus.submittedAt)}
                      </strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex-shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        Pembaruan Terakhir
                      </span>
                      <strong className="text-xs font-semibold text-slate-800">
                        {formatDate(applicationStatus.lastUpdated)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Instructions / Notice box */}
                <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 space-y-1">
                    <strong className="text-teal-950 font-bold block">Instruksi Penting:</strong>
                    <p>• Pastikan nomor WhatsApp dan email yang Anda daftarkan aktif setiap saat.</p>
                    <p>• Seluruh undangan interview dan kelanjutan seleksi dikirimkan resmi oleh tim HR BDP.</p>
                    <p>• Waspadai oknum yang memungut biaya. Proses seleksi PT Batara Dharma Persada 100% gratis.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results: Error State / Not Found */}
          {error && isSearched && !applicationStatus && (
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">
                  ID Aplikasi Tidak Ditemukan
                </h3>
                <p className="text-xs text-slate-600">
                  Sistem tidak dapat menemukan data lamaran dengan ID &quot;
                  <span className="text-rose-600 font-mono font-bold">{applicationId}</span>
                  &quot;.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left max-w-md mx-auto text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-900">Tips Pengecekan:</p>
                <p>• Periksa kembali tanda terima atau konfirmasi submit form Anda.</p>
                <p>• Pastikan tidak ada spasi di awal atau akhir ID.</p>
                <p>• ID bersifat peka huruf besar-kecil (case-sensitive).</p>
              </div>

              <button
                onClick={resetSearch}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors shadow-xs"
              >
                Coba Cari Ulang
              </button>
            </div>
          )}

          {/* Action Card: Navigation & Support */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-6">
            <div className="space-y-1 max-w-lg mx-auto">
              <h3 className="text-base font-bold text-slate-900">
                Butuh Navigasi atau Bantuan Lain?
              </h3>
              <p className="text-xs text-slate-600">
                Anda dapat kembali ke halaman utama portal, menjelajahi informasi posisi yang tersedia, atau mengunjungi website resmi perusahaan.
              </p>
            </div>

            {/* Action Buttons: Explicitly routes "Kembali ke Beranda" to / */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all transform hover:-translate-y-0.5"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Link>

              <Link
                href="/informasi-posisi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs border border-slate-300 shadow-xs transition-colors"
              >
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>Lihat Informasi Posisi</span>
              </Link>

              <a
                href="https://www.bataramining.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs border border-slate-300 shadow-xs transition-colors"
              >
                <span>Website Batara Mining</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default function CheckApplicationStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-600">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
          <p className="text-xs font-medium">Memuat Halaman Pelacakan Status...</p>
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
