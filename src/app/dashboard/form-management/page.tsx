"use client";
import React, { useState, useEffect } from "react";
import {
  FormSettingsService,
  FormSettings,
  ToggleFormStatusData,
} from "@/services/form-settings.service";
import { useAuth } from "@/context/useAuth";
import { withAuthGuard } from "@/components/withGuard";
import {
  Lock,
  Unlock,
  Loader2,
  Calendar,
  FileText,
  Briefcase,
  X,
  Edit,
  Save,
  RefreshCw,
  Users,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Settings,
  Eye,
  EyeOff,
  UserCheck,
  CalendarDays,
  Clock3,
} from "lucide-react";
import Swal from "sweetalert2";
import { Position } from "@/types/types";
import { PublicRecruitmentService } from "@/services/public-recruitment.service";

function FormManagementPage() {
  const { user } = useAuth();
  const [formSettings, setFormSettings] = useState<FormSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPositionDetails, setShowPositionDetails] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    dueDate: "",
    reason: "",
    openAllPositions: true,
    selectedPositions: [] as Position[],
    positionCounts: {} as Record<string, number>,
    requirements: {
      maxAge: null as number | null,
      gender: null as "Laki-Laki" | "Perempuan" | null,
      minWeight: null as number | null,
      maxWeight: null as number | null,
      minHeight: null as number | null,
      maxHeight: null as number | null,
      workExperience: null as "Fresh Graduated" | "Experienced" | null,
    },
  });

  // Check if user has permission
  const canManage =
    user?.role === "HR" ||
    user?.role === "ADMIN" ||
    user?.role === "MANAGEMENT";

  useEffect(() => {
    if (canManage) {
      fetchFormSettings();
      fetchPositions();
    }
  }, [canManage]);

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (formSettings) {
      setFormData({
        dueDate: formSettings.dueDate
          ? new Date(formSettings.dueDate).toISOString().slice(0, 16)
          : "",
        reason: formSettings.reason || "",
        openAllPositions:
          !formSettings.openPositions ||
          formSettings.openPositions.length === 0,
        selectedPositions: formSettings.openPositions || [],
        positionCounts: (formSettings.positionCounts as Record<string, number>) || {},
        requirements: formSettings.requirements ? {
          maxAge: formSettings.requirements.maxAge ?? null,
          gender: formSettings.requirements.gender ?? null,
          minWeight: formSettings.requirements.minWeight ?? null,
          maxWeight: formSettings.requirements.maxWeight ?? null,
          minHeight: formSettings.requirements.minHeight ?? null,
          maxHeight: formSettings.requirements.maxHeight ?? null,
          workExperience: formSettings.requirements.workExperience ?? null,
        } : {
          maxAge: null,
          gender: null,
          minWeight: null,
          maxWeight: null,
          minHeight: null,
          maxHeight: null,
          workExperience: null,
        },
      });
    }
  }, [formSettings]);

  // Initialize position counts when positions are loaded
  useEffect(() => {
    if (formData.openAllPositions && positions.length > 0) {
      const initialCounts: Record<string, number> = {};
      let needsUpdate = false;
      positions.forEach((position) => {
        if (!formData.positionCounts?.[position]) {
          initialCounts[position] = 1;
          needsUpdate = true;
        }
      });
      if (needsUpdate) {
        setFormData((prev) => ({
          ...prev,
          positionCounts: { ...prev.positionCounts, ...initialCounts },
        }));
      }
    }
  }, [positions.length, formData.openAllPositions]);

  const fetchFormSettings = async () => {
    try {
      setLoading(true);
      const response = await FormSettingsService.getFormSettings();
      setFormSettings(response.formSettings);
    } catch (error: any) {
      console.error("Error fetching form settings:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Gagal memuat pengaturan form";
      const statusCode = error?.response?.status;
      
      Swal.fire({
        title: "Kesalahan",
        html: statusCode === 404 
          ? `<p>Endpoint tidak ditemukan (404)</p><p class="text-sm text-gray-400 mt-2">Pastikan API server berjalan dan endpoint /api/form-settings tersedia</p>`
          : `<p>${errorMessage}</p>${statusCode ? `<p class="text-sm text-gray-400 mt-2">Status: ${statusCode}</p>` : ''}`,
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      setLoadingPositions(true);
      const response = await PublicRecruitmentService.getFormOptions();
      if (response.options?.positions) {
        setPositions(response.options.positions as Position[]);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoadingPositions(false);
    }
  };

  const handleToggleForm = async () => {
    if (!formSettings) return;

    const isCurrentlyOpen = formSettings.isFormOpen;
    const action = isCurrentlyOpen ? "menutup" : "membuka";

    // Validate required fields when opening form
    if (!isCurrentlyOpen) {
      if (!formData.dueDate) {
        Swal.fire({
          title: "Kesalahan",
          text: "Tanggal penutupan harus diisi sebelum membuka form",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
        return;
      }

      if (new Date(formData.dueDate) <= new Date()) {
        Swal.fire({
          title: "Kesalahan",
          text: "Tanggal penutupan harus di masa depan",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
        return;
      }

      if (!formData.reason || formData.reason.trim() === "") {
        Swal.fire({
          title: "Kesalahan",
          text: "Alasan membuka form harus diisi",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
        return;
      }

      // Validate position counts
      if (formData.openAllPositions) {
        for (const position of positions) {
          const count = formData.positionCounts[position];
          if (!count || count < 1) {
            Swal.fire({
              title: "Kesalahan",
              text: `Jumlah posisi untuk "${position.replace(/_/g, " ")}" harus diisi (minimal 1)`,
              icon: "error",
              confirmButtonColor: "#dc2626",
              background: "#1f2937",
              color: "#f9fafb",
            });
            return;
          }
        }
      } else {
        if (formData.selectedPositions.length === 0) {
          Swal.fire({
            title: "Kesalahan",
            text: "Pilih minimal satu posisi atau centang 'Buka Semua Posisi'",
            icon: "error",
            confirmButtonColor: "#dc2626",
            background: "#1f2937",
            color: "#f9fafb",
          });
          return;
        }
        for (const position of formData.selectedPositions) {
          const count = formData.positionCounts[position];
          if (!count || count < 1) {
            Swal.fire({
              title: "Kesalahan",
              text: `Jumlah posisi untuk "${position.replace(/_/g, " ")}" harus diisi (minimal 1)`,
              icon: "error",
              confirmButtonColor: "#dc2626",
              background: "#1f2937",
              color: "#f9fafb",
            });
            return;
          }
        }
      }
    }

    const result = await Swal.fire({
      title: `Apakah Anda yakin ingin ${action} form?`,
      html: isCurrentlyOpen
        ? "<p>Form akan ditutup dan kandidat tidak dapat mengirim aplikasi</p>"
        : `<p>Form akan dibuka dengan pengaturan berikut:</p>
           <ul class="text-left mt-2 space-y-1">
             <li>Tanggal penutupan: <strong>${new Date(formData.dueDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</strong></li>
             <li>Alasan: <strong>${formData.reason}</strong></li>
             <li>Posisi: <strong>${formData.openAllPositions ? 'Semua posisi' : `${formData.selectedPositions.length} posisi terpilih`}</strong></li>
           </ul>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: isCurrentlyOpen ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Ya, ${action}`,
      cancelButtonText: "Batal",
      background: "#1f2937",
      color: "#f9fafb",
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      const data: ToggleFormStatusData = {
        isFormOpen: !isCurrentlyOpen,
        dueDate: isCurrentlyOpen ? null : formData.dueDate,
        reason: isCurrentlyOpen ? null : formData.reason.trim(),
        openPositions: isCurrentlyOpen
          ? []
          : formData.openAllPositions
          ? []
          : formData.selectedPositions,
        positionCounts: isCurrentlyOpen
          ? null
          : formData.openAllPositions
          ? Object.fromEntries(
              positions.map((pos) => [
                pos,
                formData.positionCounts[pos] || 1,
              ])
            )
          : Object.fromEntries(
              formData.selectedPositions.map((pos) => [
                pos,
                formData.positionCounts[pos] || 1,
              ])
            ),
        requirements: isCurrentlyOpen ? null : formData.requirements,
      };

      const response = await FormSettingsService.toggleFormStatus(data);
      setFormSettings(response.formSettings);
      setIsEditing(false);

      Swal.fire({
        title: "Berhasil!",
        text: `Form berhasil ${action}`,
        icon: "success",
        confirmButtonColor: "#10b981",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } catch (error: any) {
      console.error(`Error ${action} form:`, error);
      Swal.fire({
        title: "Kesalahan",
        text: error.response?.data?.message || `Gagal ${action} form`,
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!formSettings) return;

    // Validation
    if (!formData.dueDate) {
      Swal.fire({
        title: "Kesalahan",
        text: "Tanggal penutupan harus diisi",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    if (new Date(formData.dueDate) <= new Date()) {
      Swal.fire({
        title: "Kesalahan",
        text: "Tanggal penutupan harus di masa depan",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    if (!formData.reason || formData.reason.trim() === "") {
      Swal.fire({
        title: "Kesalahan",
        text: "Alasan membuka form harus diisi",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    // Validate position counts
    if (formData.openAllPositions) {
      for (const position of positions) {
        const count = formData.positionCounts[position];
        if (!count || count < 1) {
          Swal.fire({
            title: "Kesalahan",
            text: `Jumlah posisi untuk "${position.replace(/_/g, " ")}" harus diisi (minimal 1)`,
            icon: "error",
            confirmButtonColor: "#dc2626",
            background: "#1f2937",
            color: "#f9fafb",
          });
          return;
        }
      }
    } else {
      if (formData.selectedPositions.length === 0) {
        Swal.fire({
          title: "Kesalahan",
          text: "Pilih minimal satu posisi atau centang 'Buka Semua Posisi'",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
        return;
      }
      for (const position of formData.selectedPositions) {
        const count = formData.positionCounts[position];
        if (!count || count < 1) {
          Swal.fire({
            title: "Kesalahan",
            text: `Jumlah posisi untuk "${position.replace(/_/g, " ")}" harus diisi (minimal 1)`,
            icon: "error",
            confirmButtonColor: "#dc2626",
            background: "#1f2937",
            color: "#f9fafb",
          });
          return;
        }
      }
    }

    try {
      setSaving(true);
      const data: ToggleFormStatusData = {
        isFormOpen: formSettings.isFormOpen,
        dueDate: formData.dueDate,
        reason: formData.reason.trim(),
        openPositions: formData.openAllPositions ? [] : formData.selectedPositions,
        positionCounts: formData.openAllPositions
          ? Object.fromEntries(
              positions.map((pos) => [
                pos,
                formData.positionCounts[pos] || 1,
              ])
            )
          : Object.fromEntries(
              formData.selectedPositions.map((pos) => [
                pos,
                formData.positionCounts[pos] || 1,
              ])
            ),
        requirements: formData.requirements,
      };

      const response = await FormSettingsService.toggleFormStatus(data);
      setFormSettings(response.formSettings);
      setIsEditing(false);

      Swal.fire({
        title: "Berhasil!",
        text: "Pengaturan form berhasil diperbarui",
        icon: "success",
        confirmButtonColor: "#10b981",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } catch (error: any) {
      console.error("Error updating form settings:", error);
      Swal.fire({
        title: "Kesalahan",
        text: error.response?.data?.message || "Gagal memperbarui pengaturan form",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePosition = (position: Position) => {
    if (formData.selectedPositions.includes(position)) {
      const newCounts = { ...formData.positionCounts };
      delete newCounts[position];
      setFormData({
        ...formData,
        selectedPositions: formData.selectedPositions.filter(
          (p) => p !== position
        ),
        positionCounts: newCounts,
      });
    } else {
      setFormData({
        ...formData,
        selectedPositions: [...formData.selectedPositions, position],
        positionCounts: {
          ...formData.positionCounts,
          [position]: formData.positionCounts[position] || 1,
        },
      });
    }
  };

  const handlePositionCountChange = (position: Position, count: number) => {
    setFormData({
      ...formData,
      positionCounts: {
        ...formData.positionCounts,
        [position]: count,
      },
    });
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (!canManage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Akses Ditolak
          </h1>
          <p className="text-gray-400">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Memuat pengaturan form...</p>
        </div>
      </div>
    );
  }

  const isOpen = formSettings?.isFormOpen ?? false;
  const openPositionsList =
    formSettings?.openPositions && formSettings.openPositions.length > 0
      ? formSettings.openPositions
      : positions;
  const totalPositions = openPositionsList.length;
  const totalNeeded = formSettings?.positionCounts
    ? Object.values(formSettings.positionCounts as Record<string, number>).reduce(
        (sum, count) => sum + count,
        0
      )
    : 0;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-xl border border-slate-600/30 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg border border-blue-400/30">
                <Settings className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Manajemen Form Recruitment
                </h1>
                <p className="text-gray-400 text-sm">
                  Kelola status dan pengaturan form recruitment
                </p>
              </div>
            </div>
            <button
              onClick={fetchFormSettings}
              disabled={loading}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Muat Ulang
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-xl border border-slate-600/30 shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-lg ${
                  isOpen
                    ? "bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/30"
                    : "bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-400/30"
                }`}
              >
                {isOpen ? (
                  <Unlock className="w-6 h-6 text-green-400" />
                ) : (
                  <Lock className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Status Form: {isOpen ? "Terbuka" : "Tertutup"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isOpen
                    ? "Form saat ini terbuka untuk publik"
                    : "Form saat ini ditutup"}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleForm}
              disabled={saving || (!isOpen && (!formData.dueDate || !formData.reason || formData.reason.trim() === ""))}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isOpen
                  ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              title={!isOpen && (!formData.dueDate || !formData.reason || formData.reason.trim() === "") 
                ? "Isi tanggal penutupan dan alasan terlebih dahulu" 
                : ""}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : isOpen ? (
                <>
                  <Lock className="w-4 h-4" />
                  Tutup Form
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Buka Form
                </>
              )}
            </button>
          </div>

          {/* Status Details */}
          <div className="grid md:grid-cols-2 gap-4">
            {isOpen && formSettings?.dueDate && (
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Tanggal Penutupan
                  </span>
                </div>
                <p className="text-white font-semibold">
                  {formatDate(formSettings.dueDate)}
                </p>
              </div>
            )}

            {isOpen && formSettings?.reason && (
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Alasan
                  </span>
                </div>
                <p className="text-white">{formSettings.reason}</p>
              </div>
            )}

            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">
                  Posisi Terbuka
                </span>
              </div>
              <p className="text-white font-semibold">
                {formSettings?.openPositions &&
                formSettings.openPositions.length > 0
                  ? `${formSettings.openPositions.length} posisi`
                  : "Semua posisi"}
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">
                  Total Kandidat Dibutuhkan
                </span>
              </div>
              <p className="text-white font-semibold text-2xl">
                {totalNeeded} kandidat
              </p>
            </div>

            {formSettings?.updatedBy && (
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Terakhir Diupdate Oleh
                  </span>
                </div>
                <p className="text-white font-semibold">
                  {formSettings.updatedBy.name}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {formSettings.updatedBy.email} ({formSettings.updatedBy.role})
                </p>
              </div>
            )}

             {formSettings?.updatedAt && (
               <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                 <div className="flex items-center space-x-2 mb-2">
                   <Clock className="w-4 h-4 text-blue-400" />
                   <span className="text-sm font-medium text-gray-300">
                     Terakhir Diupdate
                   </span>
                 </div>
                 <p className="text-white font-semibold">
                   {formatDate(formSettings.updatedAt)}
                 </p>
               </div>
             )}

             {isOpen && formSettings?.requirements && (
               <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 md:col-span-2">
                 <div className="flex items-center space-x-2 mb-3">
                   <UserCheck className="w-4 h-4 text-blue-400" />
                   <span className="text-sm font-medium text-gray-300">
                     Persyaratan Kandidat
                   </span>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                   {formSettings.requirements.maxAge && (
                     <div>
                       <span className="text-gray-400">Usia Maks:</span>
                       <span className="text-white ml-2 font-medium">
                         {formSettings.requirements.maxAge} tahun
                       </span>
                     </div>
                   )}
                   {formSettings.requirements.gender && (
                     <div>
                       <span className="text-gray-400">Jenis Kelamin:</span>
                       <span className="text-white ml-2 font-medium">
                         {formSettings.requirements.gender}
                       </span>
                     </div>
                   )}
                   {(formSettings.requirements.minWeight ||
                     formSettings.requirements.maxWeight) && (
                     <div>
                       <span className="text-gray-400">Berat Badan:</span>
                       <span className="text-white ml-2 font-medium">
                         {formSettings.requirements.minWeight
                           ? `${formSettings.requirements.minWeight}`
                           : ""}
                         {formSettings.requirements.minWeight &&
                         formSettings.requirements.maxWeight
                           ? " - "
                           : ""}
                         {formSettings.requirements.maxWeight
                           ? `${formSettings.requirements.maxWeight}`
                           : ""}
                         {" kg"}
                       </span>
                     </div>
                   )}
                   {(formSettings.requirements.minHeight ||
                     formSettings.requirements.maxHeight) && (
                     <div>
                       <span className="text-gray-400">Tinggi Badan:</span>
                       <span className="text-white ml-2 font-medium">
                         {formSettings.requirements.minHeight
                           ? `${formSettings.requirements.minHeight}`
                           : ""}
                         {formSettings.requirements.minHeight &&
                         formSettings.requirements.maxHeight
                           ? " - "
                           : ""}
                         {formSettings.requirements.maxHeight
                           ? `${formSettings.requirements.maxHeight}`
                           : ""}
                         {" cm"}
                       </span>
                     </div>
                   )}
                   {formSettings.requirements.workExperience && (
                     <div>
                       <span className="text-gray-400">Pengalaman:</span>
                       <span className="text-white ml-2 font-medium">
                         {formSettings.requirements.workExperience}
                       </span>
                     </div>
                   )}
                 </div>
               </div>
             )}
           </div>
         </div>

        {/* Edit Form Section */}
        <div className="bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-xl border border-slate-600/30 shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Edit className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">
                Edit Pengaturan Form
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPositionDetails(!showPositionDetails)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {showPositionDetails ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Sembunyikan Detail
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Tampilkan Detail
                  </>
                )}
              </button>
              {!isOpen && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                  {formData.dueDate && formData.reason && formData.reason.trim() !== "" ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-medium">
                        Form siap dibuka
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm">
                        Lengkapi form untuk membuka
                      </span>
                    </>
                  )}
                </div>
              )}
              {isOpen && (
                <>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data
                          if (formSettings) {
                             setFormData({
                               dueDate: formSettings.dueDate
                                 ? new Date(formSettings.dueDate)
                                     .toISOString()
                                     .slice(0, 16)
                                 : "",
                               reason: formSettings.reason || "",
                               openAllPositions:
                                 !formSettings.openPositions ||
                                 formSettings.openPositions.length === 0,
                               selectedPositions: formSettings.openPositions || [],
                               positionCounts:
                                 (formSettings.positionCounts as Record<
                                   string,
                                   number
                                 >) || {},
                               requirements: formSettings.requirements ? {
                                 maxAge: formSettings.requirements.maxAge ?? null,
                                 gender: formSettings.requirements.gender ?? null,
                                 minWeight: formSettings.requirements.minWeight ?? null,
                                 maxWeight: formSettings.requirements.maxWeight ?? null,
                                 minHeight: formSettings.requirements.minHeight ?? null,
                                 maxHeight: formSettings.requirements.maxHeight ?? null,
                                 workExperience: formSettings.requirements.workExperience ?? null,
                               } : {
                                 maxAge: null,
                                 gender: null,
                                 minWeight: null,
                                 maxWeight: null,
                                 minHeight: null,
                                 maxHeight: null,
                                 workExperience: null,
                               },
                             });
                          }
                        }}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Simpan
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {!isOpen && (
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-blue-200 text-sm font-medium mb-1">
                    Form saat ini tertutup
                  </p>
                  <p className="text-blue-300 text-xs">
                    Isi form di bawah ini untuk membuka form. Pastikan semua field yang wajib (*) sudah diisi sebelum klik tombol "Buka Form".
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Due Date - Modern Date Time Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                <CalendarDays className="w-4 h-4" />
                <span>Tanggal Penutupan *</span>
              </label>
              
              {/* Preview Selected Date */}
              {formData.dueDate && (
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Dipilih:</span>
                    <span className="text-sm font-semibold text-blue-300">
                      {(() => {
                        const date = new Date(formData.dueDate);
                        const dateStr = date.toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                        const timeStr = date.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        });
                        return `${dateStr} pukul ${timeStr}`;
                      })()}
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Select Buttons */}
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(23, 59, 0, 0);
                    setFormData({
                      ...formData,
                      dueDate: tomorrow.toISOString().slice(0, 16),
                    });
                  }}
                  disabled={isOpen && !isEditing}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Besok
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    nextWeek.setHours(23, 59, 0, 0);
                    setFormData({
                      ...formData,
                      dueDate: nextWeek.toISOString().slice(0, 16),
                    });
                  }}
                  disabled={isOpen && !isEditing}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  7 Hari Lagi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    nextMonth.setHours(23, 59, 0, 0);
                    setFormData({
                      ...formData,
                      dueDate: nextMonth.toISOString().slice(0, 16),
                    });
                  }}
                  disabled={isOpen && !isEditing}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  1 Bulan Lagi
                </button>
              </div>

              {/* Date Input */}
              <div className="relative">
                <label className="block text-xs text-gray-400 mb-2 flex items-center space-x-1">
                  <CalendarDays className="w-3 h-3" />
                  <span>Tanggal Penutupan</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dueDate ? formData.dueDate.split("T")[0] : ""}
                    onChange={(e) => {
                      const date = e.target.value;
                      // Set waktu default ke 23:59
                      setFormData({
                        ...formData,
                        dueDate: date ? `${date}T23:59` : "",
                      });
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    disabled={isOpen && !isEditing}
                    className="w-full px-4 py-3 pl-10 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <p className="mt-2 text-xs text-gray-400 flex items-center space-x-1">
                  <Clock3 className="w-3 h-3" />
                  <span>Waktu otomatis di-set ke 23:59 (11:59 PM)</span>
                </p>
              </div>

              {/* Helper Text */}
              <p className="mt-2 text-xs text-gray-400 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Tanggal harus di masa depan. Form akan otomatis ditutup pada tanggal yang dipilih pukul 23:59.</span>
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Alasan Membuka Form *</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Contoh: Rekrutmen untuk posisi Production Engineering..."
                rows={3}
                disabled={isOpen && !isEditing}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Position Selection */}
            {showPositionDetails && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Posisi yang Dibuka</span>
                </label>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.openAllPositions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openAllPositions: e.target.checked,
                          selectedPositions: e.target.checked
                            ? []
                            : formData.selectedPositions,
                          positionCounts: e.target.checked
                            ? {}
                            : formData.positionCounts,
                        })
                      }
                      disabled={isOpen && !isEditing}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-gray-300">Buka Semua Posisi</span>
                  </label>

                  <div className="bg-slate-700/30 rounded-lg border border-slate-600 max-h-96 overflow-y-auto p-4">
                    {loadingPositions ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                        <span className="ml-2 text-gray-400">
                          Memuat posisi...
                        </span>
                      </div>
                    ) : positions.length === 0 ? (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        Tidak ada posisi tersedia
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {positions.map((position) => {
                          const isSelected = formData.openAllPositions
                            ? true
                            : formData.selectedPositions.includes(position);
                          return (
                            <div
                              key={position}
                              className={`p-3 rounded-lg border ${
                                isSelected
                                  ? "bg-slate-600/50 border-blue-500/50"
                                  : "bg-slate-700/30 border-slate-600"
                              }`}
                            >
                              {!formData.openAllPositions && (
                                <label className="flex items-center space-x-2 cursor-pointer mb-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => togglePosition(position)}
                                    disabled={isOpen && !isEditing}
                                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                  <span className="text-sm font-medium text-gray-300">
                                    {position.replace(/_/g, " ")}
                                  </span>
                                </label>
                              )}
                              {formData.openAllPositions && (
                                <span className="text-sm font-medium text-gray-300 block mb-2">
                                  {position.replace(/_/g, " ")}
                                </span>
                              )}
                              {isSelected && (
                                <div
                                  className={
                                    formData.openAllPositions
                                      ? "mt-2"
                                      : "mt-2 ml-6"
                                  }
                                >
                                  <label className="block text-xs text-gray-400 mb-1">
                                    Posisi Dibutuhkan *
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={
                                      formData.positionCounts?.[position] || 1
                                    }
                                    onChange={(e) => {
                                      const count =
                                        parseInt(e.target.value) || 1;
                                      handlePositionCountChange(
                                        position,
                                        Math.max(1, count)
                                      );
                                    }}
                                    disabled={isOpen && !isEditing}
                                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Jumlah posisi"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                 </div>
               </div>
             )}

             {/* Requirements Section */}
             <div className="border-t border-slate-600/30 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <UserCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                  Persyaratan Kandidat
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Tentukan persyaratan untuk kandidat (opsional)
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Max Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Usia Maksimal
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.requirements.maxAge || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          maxAge: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        },
                      })
                    }
                    disabled={isOpen && !isEditing}
                    placeholder="Contoh: 35"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.requirements.gender || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          gender: e.target.value
                            ? (e.target.value as "Laki-Laki" | "Perempuan")
                            : null,
                        },
                      })
                    }
                    disabled={isOpen && !isEditing}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* Min Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Berat Badan Minimum (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.requirements.minWeight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          minWeight: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        },
                      })
                    }
                    disabled={isOpen && !isEditing}
                    placeholder="Contoh: 50"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Max Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Berat Badan Maksimal (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.requirements.maxWeight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          maxWeight: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        },
                      })
                    }
                    disabled={isOpen && !isEditing}
                    placeholder="Contoh: 100"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Min Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tinggi Badan Minimum (cm)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.requirements.minHeight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          minHeight: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        },
                      })
                    }
                    disabled={isOpen && !isEditing}
                    placeholder="Contoh: 160"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Max Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tinggi Badan Maksimal (cm)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.requirements.maxHeight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          maxHeight: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        },
                      })
                    }
                    disabled={isOpen && !isEditing}
                    placeholder="Contoh: 200"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Work Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pengalaman Kerja
                  </label>
                  <select
                    value={formData.requirements.workExperience || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          workExperience: e.target.value
                            ? (e.target.value as
                                | "Fresh Graduated"
                                | "Experienced")
                            : null,
                        },
                      })
                    }
                    disabled={isOpen && !isEditing}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Pengalaman Kerja</option>
                    <option value="Fresh Graduated">Fresh Graduate</option>
                    <option value="Experienced">Berpengalaman</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default withAuthGuard(FormManagementPage);

