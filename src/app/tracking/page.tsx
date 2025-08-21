"use client";
import React, { useState } from "react";
import { PublicRecruitmentService } from "@/services/public-recruitment.service";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader,
  Calendar,
  User,
  Briefcase,
  RefreshCw,
  ArrowLeft,
  Home,
} from "lucide-react";
import Swal from "sweetalert2";

interface ApplicationStatus {
  id: string;
  applicantName: string;
  position: string;
  status: string;
  submittedAt: string;
  lastUpdated: string;
}

const CheckApplicationStatusPage: React.FC = () => {
  const [applicationId, setApplicationId] = useState("");
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!applicationId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ID Aplikasi Diperlukan!",
        text: "Mohon masukkan ID aplikasi Anda untuk melakukan pencarian.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setApplicationStatus(null);

    try {
      const response = await PublicRecruitmentService.checkApplicationStatus(
        applicationId.trim()
      );
      setApplicationStatus(response.application);
      setIsSearched(true);

      // Show success toast
      Swal.fire({
        icon: "success",
        title: "Status Ditemukan!",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error: any) {
      const errorMessage = PublicRecruitmentService.formatErrorMessage(error);
      setError(errorMessage);
      setIsSearched(true);

      if (error.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Aplikasi Tidak Ditemukan!",
          text: "ID aplikasi yang Anda masukkan tidak valid atau tidak ditemukan dalam sistem.",
          confirmButtonColor: "#dc2626",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Mencari Status!",
          text: errorMessage,
          confirmButtonColor: "#dc2626",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setApplicationId("");
    setApplicationStatus(null);
    setIsSearched(false);
    setError(null);
  };

const goToHomepage = () => {
  window.location.href = "https://www.bataramining.com";
};

  const goToApplyPage = () => {
    // Assuming the apply page route is '/apply' - adjust as needed
    window.location.href = "/apply";
  };

  // Get status icon and styling
  const getStatusDisplay = (status: string) => {
    const statusInfo = PublicRecruitmentService.getStatusInfo(status);

    const statusConfig = {
      PENDING: {
        icon: <Clock className="h-6 w-6" />,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        iconColor: "text-yellow-600",
        borderColor: "border-yellow-200",
      },
      ON_PROGRESS: {
        icon: <RefreshCw className="h-6 w-6" />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconColor: "text-blue-600",
        borderColor: "border-blue-200",
      },
      INTERVIEW: {
        icon: <User className="h-6 w-6" />,
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        iconColor: "text-purple-600",
        borderColor: "border-purple-200",
      },
      PSIKOTEST: {
        icon: <FileText className="h-6 w-6" />,
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-800",
        iconColor: "text-indigo-600",
        borderColor: "border-indigo-200",
      },
      USER_INTERVIEW: {
        icon: <User className="h-6 w-6" />,
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        iconColor: "text-purple-600",
        borderColor: "border-purple-200",
      },
      MEDICAL_CHECKUP: {
        icon: <FileText className="h-6 w-6" />,
        bgColor: "bg-teal-100",
        textColor: "text-teal-800",
        iconColor: "text-teal-600",
        borderColor: "border-teal-200",
      },
      MEDICAL_FOLLOWUP: {
        icon: <RefreshCw className="h-6 w-6" />,
        bgColor: "bg-teal-100",
        textColor: "text-teal-800",
        iconColor: "text-teal-600",
        borderColor: "border-teal-200",
      },
      HIRED: {
        icon: <CheckCircle className="h-6 w-6" />,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        iconColor: "text-green-600",
        borderColor: "border-green-200",
      },
      REJECTED: {
        icon: <XCircle className="h-6 w-6" />,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        iconColor: "text-red-600",
        borderColor: "border-red-200",
      },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    );
  };

  // Format status text for display
  const formatStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Menunggu Review",
      ON_PROGRESS: "Sedang Diproses",
      INTERVIEW: "Tahap Interview",
      PSIKOTEST: "Tahap Tes Psikologi",
      USER_INTERVIEW: "Interview User",
      MEDICAL_CHECKUP: "Medical Check-up",
      MEDICAL_FOLLOWUP: "Follow-up Medical",
      HIRED: "Diterima",
      REJECTED: "Ditolak",
    };

    return statusMap[status] || status;
  };

  // Get status description
  const getStatusDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      PENDING:
        "Aplikasi Anda sedang menunggu untuk direview oleh tim HR kami. Mohon bersabar, kami akan segera memproses aplikasi Anda.",
      ON_PROGRESS:
        "Aplikasi Anda sedang dalam proses review. Tim HR kami sedang mengevaluasi kelengkapan dokumen dan kualifikasi Anda.",
      INTERVIEW:
        "Selamat! Anda telah lolos seleksi awal. Tim HR akan menghubungi Anda untuk mengatur jadwal interview.",
      PSIKOTEST:
        "Anda akan mengikuti tes psikologi sebagai bagian dari proses seleksi. Informasi lebih lanjut akan diberikan melalui email atau telepon.",
      USER_INTERVIEW:
        "Anda akan mengikuti interview dengan user/atasan langsung dari departemen yang Anda lamar.",
      MEDICAL_CHECKUP:
        "Anda diwajibkan untuk menjalani pemeriksaan kesehatan (medical check-up) sebagai bagian dari proses seleksi.",
      MEDICAL_FOLLOWUP:
        "Terdapat tindak lanjut dari hasil medical check-up Anda. Tim HR akan menghubungi Anda dengan informasi lebih lanjut.",
      HIRED:
        "Proses rekrutmen telah selesai. Tim HR akan menghubungi Anda dengan keputusan final dalam waktu dekat.",
      REJECTED:
        "Mohon maaf, aplikasi Anda belum berhasil pada kesempatan ini. Terima kasih atas minat Anda bergabung dengan perusahaan kami.",
    };

    return (
      descriptions[status] ||
      "Status tidak diketahui. Silakan hubungi tim HR untuk informasi lebih lanjut."
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Cek Status Lamaran
          </h1>
          <p className="text-xl text-gray-600">
            Masukkan ID aplikasi Anda untuk melihat status terkini
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ID Aplikasi
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Masukkan ID aplikasi Anda (contoh: cm1x2y3z4a5b6c7d8e9f0)"
                disabled={isLoading}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !applicationId.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Cari
                  </>
                )}
              </button>
            </div>

            {isSearched && (
              <button
                onClick={resetSearch}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Cari ID lain
              </button>
            )}
          </div>
        </div>

        {/* Status Display */}
        {applicationStatus && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Status Aplikasi Ditemukan
              </h2>
            </div>

            {/* Status Card */}
            <div className="max-w-2xl mx-auto">
              {(() => {
                const statusDisplay = getStatusDisplay(
                  applicationStatus.status
                );
                return (
                  <div
                    className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border rounded-xl p-6 mb-6`}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className={`${statusDisplay.iconColor} mr-3`}>
                        {statusDisplay.icon}
                      </div>
                      <h3
                        className={`text-2xl font-bold ${statusDisplay.textColor}`}
                      >
                        {formatStatusText(applicationStatus.status)}
                      </h3>
                    </div>

                    <p
                      className={`text-center ${statusDisplay.textColor} mb-4`}
                    >
                      {getStatusDescription(applicationStatus.status)}
                    </p>
                  </div>
                );
              })()}

              {/* Application Details */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Nama Pelamar</p>
                      <p className="font-semibold text-gray-800">
                        {applicationStatus.applicantName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Posisi yang Dilamar
                      </p>
                      <p className="font-semibold text-gray-800">
                        {applicationStatus.position
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Melamar</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(applicationStatus.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <RefreshCw className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Terakhir Diupdate</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(applicationStatus.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 mb-1">
                        Catatan Penting:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>
                          • Simpan ID aplikasi ini untuk pengecekan status di
                          kemudian hari
                        </li>
                        <li>
                          • Pastikan nomor telepon dan email Anda selalu aktif
                        </li>
                        <li>
                          • Tim HR akan menghubungi Anda melalui WhatsApp atau
                          email
                        </li>
                        <li>
                          • Jika ada pertanyaan, hubungi tim HR melalui kontak
                          yang tersedia
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && isSearched && !applicationStatus && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Aplikasi Tidak Ditemukan
              </h2>
              <p className="text-gray-600 mb-6">
                ID aplikasi yang Anda masukkan tidak valid atau tidak ditemukan
                dalam sistem kami.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-yellow-800 font-semibold mb-2">
                      Pastikan ID Aplikasi Anda Benar:
                    </h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>
                        • ID aplikasi biasanya terdiri dari 25 karakter (huruf
                        dan angka)
                      </li>
                      <li>
                        • Periksa kembali ID yang Anda terima saat mengirim
                        lamaran
                      </li>
                      <li>
                        • Pastikan tidak ada spasi tambahan di awal atau akhir
                        ID
                      </li>
                      <li>
                        • ID bersifat case-sensitive (huruf besar/kecil
                        berpengaruh)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Butuh Bantuan Lain?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={goToHomepage}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Jika Anda mengalami masalah, silakan hubungi tim HR kami melalui
              email atau telepon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckApplicationStatusPage;
