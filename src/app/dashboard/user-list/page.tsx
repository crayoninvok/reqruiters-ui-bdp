"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/useAuth";
import AuthService from "@/services/auth.service";
import Swal from "sweetalert2";
import { withAuthGuard } from "@/components/withGuard";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Calendar,
  Mail,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";

interface HRUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    hiredEmployeesProcessed?: number;
    recruitersCreated?: number;
  };
}

interface EditUserFormData {
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

// Reusable SweetAlert dark configuration
const swalDarkConfig = {
  background: "#1e293b",
  color: "#f8fafc",
  customClass: {
    popup: "rounded-2xl border border-slate-700 shadow-2xl",
    confirmButton: "px-5 py-2.5 rounded-xl font-medium",
    cancelButton: "px-5 py-2.5 rounded-xl font-medium",
  },
};

function UserList() {
  const { user } = useAuth();
  const [hrUsers, setHrUsers] = useState<HRUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<HRUser | null>(null);
  const [editFormData, setEditFormData] = useState<EditUserFormData>({
    name: "",
    email: "",
    password: "",
    avatarUrl: "",
  });
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if current user is admin
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Fetch HR users
  const fetchHRUsers = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const response = await AuthService.getHRUsers();
      setHrUsers(response.users || []);
    } catch (error: any) {
      console.error("Error fetching HR users:", error);
      Swal.fire({
        ...swalDarkConfig,
        title: "Gagal Memuat Data",
        text: error.message || "Gagal memuat daftar pengguna",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchHRUsers();
    }
  }, [isAdmin]);

  // Filtered and searched users
  const filteredUsers = useMemo(() => {
    return hrUsers.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole =
        roleFilter === "ALL" ? true : u.role.toUpperCase() === roleFilter;

      return matchQuery && matchRole;
    });
  }, [hrUsers, searchTerm, roleFilter]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalUsers = hrUsers.length;
    const totalHR = hrUsers.filter((u) => u.role.toUpperCase() === "HR").length;
    const totalAdmin = hrUsers.filter((u) => u.role.toUpperCase() === "ADMIN").length;
    const totalCandidatesProcessed = hrUsers.reduce((sum, u) => {
      return (
        sum +
        (u._count?.hiredEmployeesProcessed ??
          u._count?.recruitersCreated ??
          0)
      );
    }, 0);

    return { totalUsers, totalHR, totalAdmin, totalCandidatesProcessed };
  }, [hrUsers]);

  // Open edit modal
  const openEditModal = (hrUser: HRUser) => {
    setSelectedUser(hrUser);
    setEditFormData({
      name: hrUser.name,
      email: hrUser.email,
      password: "",
      avatarUrl: hrUser.avatarUrl || "",
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData({
      name: "",
      email: "",
      password: "",
      avatarUrl: "",
    });
    setEditErrors({});
    setShowPassword(false);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (editErrors[name as keyof FormErrors]) {
      setEditErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate edit form
  const validateEditForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!editFormData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (editFormData.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editFormData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(editFormData.email)) {
      newErrors.email = "Masukkan alamat email yang valid";
    }

    // Password validation (optional on edit)
    if (editFormData.password && editFormData.password.length > 0) {
      if (editFormData.password.length < 8) {
        newErrors.password = "Password minimal 8 karakter";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(editFormData.password)) {
        newErrors.password =
          "Password harus mengandung minimal satu huruf besar, satu huruf kecil, dan satu angka";
      }
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEditForm() || !selectedUser) {
      return;
    }

    setIsEditLoading(true);
    setEditErrors({});

    try {
      const updateData: any = {
        name: editFormData.name.trim(),
        email: editFormData.email.trim().toLowerCase(),
        avatarUrl: editFormData.avatarUrl.trim(),
      };

      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      await AuthService.updateHRUser(selectedUser.id, updateData);

      await Swal.fire({
        ...swalDarkConfig,
        title: "Berhasil Diperbarui!",
        text: `Data pengguna "${updateData.name}" berhasil diperbarui`,
        icon: "success",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Selesai",
      });

      await fetchHRUsers();
      closeEditModal();
    } catch (error: any) {
      console.error("Update user error:", error);

      Swal.fire({
        ...swalDarkConfig,
        title: "Gagal Memperbarui",
        text: error.message || "Gagal memperbarui data pengguna.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });

      if (error.message?.toLowerCase().includes("email")) {
        setEditErrors({ email: error.message });
      } else {
        setEditErrors({ general: error.message });
      }
    } finally {
      setIsEditLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (hrUser: HRUser) => {
    const candidatesProcessed =
      hrUser._count?.hiredEmployeesProcessed ??
      hrUser._count?.recruitersCreated ??
      0;

    const result = await Swal.fire({
      ...swalDarkConfig,
      title: "Hapus Pengguna?",
      html: `
        <div class="text-left text-sm space-y-3">
          <p class="text-slate-300">Anda akan menghapus akun berikut secara permanen:</p>
          <div class="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 space-y-1.5">
            <p><strong class="text-slate-400">Nama:</strong> <span class="text-white font-medium">${hrUser.name}</span></p>
            <p><strong class="text-slate-400">Email:</strong> <span class="text-slate-300">${hrUser.email}</span></p>
            <p><strong class="text-slate-400">Role:</strong> <span class="text-blue-400 font-semibold">${hrUser.role}</span></p>
            ${
              candidatesProcessed > 0
                ? `<p class="text-amber-400 mt-2 font-medium">⚠️ Perhatian: Pengguna ini telah memproses ${candidatesProcessed} data kandidat.</p>`
                : ""
            }
          </div>
          <p class="text-red-400 font-semibold text-xs">Tindakan ini tidak dapat dibatalkan!</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Ya, Hapus Pengguna",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          ...swalDarkConfig,
          title: "Menghapus Pengguna...",
          text: "Harap tunggu sementara sistem menghapus data",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        await AuthService.deleteHRUser(hrUser.id);

        await Swal.fire({
          ...swalDarkConfig,
          title: "Berhasil Dihapus!",
          text: `Pengguna "${hrUser.name}" telah dihapus`,
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        });

        await fetchHRUsers();
      } catch (error: any) {
        console.error("Delete user error:", error);

        Swal.fire({
          ...swalDarkConfig,
          title: "Gagal Menghapus",
          text: error.message || "Gagal menghapus pengguna. Silakan coba lagi.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  // Handle role change
  const handleRoleChange = async (hrUser: HRUser, newRole: string) => {
    if (hrUser.role === newRole) return;

    const result = await Swal.fire({
      ...swalDarkConfig,
      title: "Ubah Hak Akses Role?",
      html: `
        <div class="text-left text-sm space-y-3">
          <p class="text-slate-300">Ubah peran untuk akun:</p>
          <div class="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 space-y-1.5">
            <p><strong class="text-slate-400">Pengguna:</strong> <span class="text-white font-medium">${hrUser.name}</span></p>
            <p><strong class="text-slate-400">Role Saat Ini:</strong> <span class="text-slate-300">${hrUser.role}</span></p>
            <p><strong class="text-slate-400">Role Baru:</strong> <span class="text-blue-400 font-bold">${newRole}</span></p>
          </div>
          <p class="text-slate-400 text-xs">Perubahan ini akan langsung memengaruhi izin akses pengguna pada sistem.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#475569",
      confirmButtonText: `Ya, Jadikan ${newRole}`,
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          ...swalDarkConfig,
          title: "Memperbarui Role...",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        await AuthService.changeUserRole(hrUser.id, newRole);

        await Swal.fire({
          ...swalDarkConfig,
          title: "Role Diperbarui!",
          text: `Role "${hrUser.name}" kini telah diubah menjadi ${newRole}`,
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        });

        await fetchHRUsers();
      } catch (error: any) {
        console.error("Role change error:", error);

        Swal.fire({
          ...swalDarkConfig,
          title: "Gagal Mengubah Role",
          text: error.message || "Gagal mengubah role pengguna.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  // If user is not admin, show polished Access Denied
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md w-full mx-auto text-center p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-red-500/30 backdrop-blur-md shadow-2xl">
          <div className="w-16 h-16 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            Hanya administrator sistem yang memiliki hak akses untuk melihat dan
            mengelola akun pengguna.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 min-h-[500px]">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Manajemen Pengguna</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                Admin Panel
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Kelola akun pengguna HR, hak akses, dan pantau aktivitas sistem
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchHRUsers(true)}
            disabled={isLoading || isRefreshing}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-xl flex items-center gap-2 transition-all shadow-md text-sm font-medium disabled:opacity-50"
            title="Segarkan data pengguna"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isRefreshing ? "animate-spin text-blue-400" : "text-slate-400"
              }`}
            />
            <span className="hidden sm:inline">Segarkan</span>
          </button>

          <Link
            href="/dashboard/create-user"
            className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/25 text-sm font-semibold hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </Link>
        </div>
      </div>

      {/* KPI / Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/60 shadow-lg hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Total Pengguna
              </p>
              <div className="text-3xl font-bold text-white tracking-tight">
                {metrics.totalUsers}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Terdaftar dalam sistem
              </p>
            </div>
            <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* HR Users */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/60 shadow-lg hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Pengguna HR
              </p>
              <div className="text-3xl font-bold text-emerald-400 tracking-tight">
                {metrics.totalHR}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tim pengelola rekrutmen
              </p>
            </div>
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <UserCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Total Candidates Processed */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/60 shadow-lg hover:border-slate-600 transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Kandidat Diproses
              </p>
              <div className="text-3xl font-bold text-amber-400 tracking-tight">
                {metrics.totalCandidatesProcessed}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Diproses menjadi karyawan
              </p>
            </div>
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-700/60 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white p-1"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="ALL">Semua Role</option>
              <option value="HR">Role: HR</option>
              <option value="ADMIN">Role: ADMIN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      {isLoading ? (
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-16 flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-500"></div>
          </div>
          <div>
            <p className="text-white font-semibold text-base">
              Memuat Data Pengguna...
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Harap tunggu, sedang mengambil daftar pengguna dari server
            </p>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        /* Empty State */
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700/60 p-12 text-center backdrop-blur-sm shadow-xl">
          <div className="w-16 h-16 bg-slate-700/40 border border-slate-600/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserX className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1.5">
            {searchTerm || roleFilter !== "ALL"
              ? "Tidak Ada Pengguna yang Cocok"
              : "Belum Ada Pengguna HR"}
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            {searchTerm || roleFilter !== "ALL"
              ? "Tidak ditemukan pengguna yang sesuai dengan kriteria filter atau pencarian Anda. Coba atur ulang kata kunci."
              : "Belum ada akun pengguna HR terdaftar dalam sistem saat ini. Klik tombol di bawah untuk membuat pengguna baru."}
          </p>
          {searchTerm || roleFilter !== "ALL" ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("ALL");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all"
            >
              Reset Filter & Pencarian
            </button>
          ) : (
            <Link
              href="/dashboard/create-user"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Buat Pengguna Pertama</span>
            </Link>
          )}
        </div>
      ) : (
        /* Users Table Card */
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700/70 text-slate-400 uppercase text-xs tracking-wider">
                  <th className="py-4 px-6 font-semibold">Pengguna</th>
                  <th className="py-4 px-6 font-semibold">Role</th>
                  <th className="py-4 px-6 font-semibold">Kandidat Diproses</th>
                  <th className="py-4 px-6 font-semibold">Terdaftar</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-sm">
                {paginatedUsers.map((hrUser) => {
                  const candidateCount =
                    hrUser._count?.hiredEmployeesProcessed ??
                    hrUser._count?.recruitersCreated ??
                    0;

                  return (
                    <tr
                      key={hrUser.id}
                      className="hover:bg-slate-700/30 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-slate-700/80">
                            {hrUser.avatarUrl ? (
                              <img
                                src={hrUser.avatarUrl}
                                alt={hrUser.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display =
                                    "none";
                                }}
                              />
                            ) : null}
                            <span className="text-sm">
                              {hrUser.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                              {hrUser.name}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {hrUser.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            hrUser.role.toUpperCase() === "ADMIN"
                              ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                              : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {hrUser.role}
                        </span>
                      </td>

                      {/* Candidates Processed */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">
                            {candidateCount}
                          </span>
                          <span className="text-xs text-slate-400">
                            kandidat
                          </span>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(hrUser.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Role Quick Selector */}
                          <select
                            value={hrUser.role}
                            onChange={(e) =>
                              handleRoleChange(hrUser, e.target.value)
                            }
                            className="text-xs px-2.5 py-1.5 bg-slate-900/90 text-slate-200 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:border-slate-600 transition-all cursor-pointer font-medium"
                            title="Ubah Role"
                          >
                            <option value="HR">HR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(hrUser)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/15 rounded-lg border border-transparent hover:border-blue-500/30 transition-all"
                            title="Edit Pengguna"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(hrUser)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/15 rounded-lg border border-transparent hover:border-red-500/30 transition-all"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="px-6 py-4 bg-slate-900/70 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Menampilkan{" "}
              <span className="font-semibold text-white">
                {Math.min((currentPage - 1) * pageSize + 1, filteredUsers.length)}
              </span>{" "}
              hingga{" "}
              <span className="font-semibold text-white">
                {Math.min(currentPage * pageSize, filteredUsers.length)}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-white">
                {filteredUsers.length}
              </span>{" "}
              pengguna
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white transition-all border border-slate-700"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white transition-all border border-slate-700"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/70">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/15 border border-blue-500/30 rounded-xl">
                  <Edit2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Edit Pengguna
                  </h2>
                  <p className="text-xs text-slate-400">
                    Perbarui informasi akun pengguna HR
                  </p>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* General Error */}
                {editErrors.general && (
                  <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{editErrors.general}</span>
                  </div>
                )}

                {/* Avatar Preview */}
                <div className="flex items-center gap-4 p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-slate-700 flex-shrink-0">
                    {editFormData.avatarUrl ? (
                      <img
                        src={editFormData.avatarUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    <span>
                      {editFormData.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">
                      Preview Profil
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {editFormData.name || "Nama Pengguna"}
                    </p>
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2 ${
                      editErrors.name
                        ? "border-red-500/50 focus:ring-red-500/20"
                        : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                    placeholder="Masukkan nama lengkap"
                    disabled={isEditLoading}
                  />
                  {editErrors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {editErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="edit-email"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Alamat Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2 ${
                      editErrors.email
                        ? "border-red-500/50 focus:ring-red-500/20"
                        : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                    placeholder="Masukkan email resmi"
                    disabled={isEditLoading}
                  />
                  {editErrors.email && (
                    <p className="mt-1 text-xs text-red-400">
                      {editErrors.email}
                    </p>
                  )}
                </div>

                {/* Avatar URL Field */}
                <div>
                  <label
                    htmlFor="edit-avatarUrl"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    URL Avatar{" "}
                    <span className="text-slate-500 font-normal">
                      (Opsional)
                    </span>
                  </label>
                  <input
                    type="url"
                    id="edit-avatarUrl"
                    name="avatarUrl"
                    value={editFormData.avatarUrl}
                    onChange={handleEditInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="https://example.com/avatar.jpg"
                    disabled={isEditLoading}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="edit-password"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Password Baru{" "}
                    <span className="text-slate-500 font-normal">
                      (Kosongkan jika tidak diubah)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="edit-password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditInputChange}
                      className={`w-full px-3.5 py-2.5 pr-10 bg-slate-900/80 border rounded-xl text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2 ${
                        editErrors.password
                          ? "border-red-500/50 focus:ring-red-500/20"
                          : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                      }`}
                      placeholder="Masukkan password baru"
                      disabled={isEditLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {editErrors.password ? (
                    <p className="mt-1 text-xs text-red-400">
                      {editErrors.password}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Minimal 8 karakter mengandung huruf besar, huruf kecil,
                      dan angka.
                    </p>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/60 mt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={isEditLoading}
                    className="flex-1 py-2.5 px-4 border border-slate-700 hover:bg-slate-700/50 text-slate-300 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isEditLoading}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isEditLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuthGuard(UserList);