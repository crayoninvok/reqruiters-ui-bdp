"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/useAuth";
import AuthService from "@/services/auth.service";
import Swal from "sweetalert2";
import { withAuthGuard } from "@/components/withGuard";
import { UserPlus, Eye, EyeOff, AlertCircle, Info, Shield } from "lucide-react";

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function CreateUser() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateUserFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Masukkan alamat email yang valid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password harus mengandung minimal satu huruf besar, satu huruf kecil, dan satu angka";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Silakan konfirmasi password Anda";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      await AuthService.createHRUser(userData);

      // Success notification
      await Swal.fire({
        title: "Berhasil!",
        text: `Pengguna HR "${userData.name}" berhasil dibuat`,
        icon: "success",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
        customClass: {
          popup: "rounded-xl",
        },
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error: any) {
      console.error("Create user error:", error);
      
      // Show error notification
      Swal.fire({
        title: "Error",
        text: error.message || "Gagal membuat pengguna. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
        customClass: {
          popup: "rounded-xl",
        },
      });

      // Set form error if it's a validation error
      if (error.message.toLowerCase().includes("email")) {
        setErrors({ email: error.message });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md mx-auto text-center p-6 bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-600/30 shadow-xl">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Akses Ditolak</h2>
          <p className="text-gray-300">
            Hanya administrator yang dapat membuat pengguna baru. Silakan hubungi administrator sistem Anda jika memerlukan akses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Buat Pengguna HR Baru
            </span>
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-400">
          Buat akun pengguna HR baru untuk mengelola proses rekrutmen dan data kandidat.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 overflow-hidden">
        <div className="p-5 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-2">
                Nama Lengkap <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-400 ${
                  errors.name
                    ? "bg-slate-700/50 border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : "bg-slate-700/50 border-slate-600/50 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
                placeholder="Masukkan nama lengkap"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
                Alamat Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-400 ${
                  errors.email
                    ? "bg-slate-700/50 border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : "bg-slate-700/50 border-slate-600/50 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
                placeholder="Masukkan alamat email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg sm:rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-400 ${
                    errors.password
                      ? "bg-slate-700/50 border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "bg-slate-700/50 border-slate-600/50 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="Masukkan password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
              <div className="mt-2">
                <p className="text-xs text-gray-400">
                  Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, dan angka.
                </p>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200 mb-2">
                Konfirmasi Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg sm:rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-400 ${
                    errors.confirmPassword
                      ? "bg-slate-700/50 border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "bg-slate-700/50 border-slate-600/50 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="Konfirmasi password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed focus:ring-gray-500"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:transform active:scale-[0.98] shadow-lg hover:shadow-xl focus:ring-blue-500"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Membuat Pengguna...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Buat Pengguna HR</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-900/30 via-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-700/30 rounded-xl sm:rounded-2xl p-5 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="flex-shrink-0 p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-blue-300 mb-2 sm:mb-3">Informasi Penting</h3>
            <ul className="text-xs sm:text-sm text-blue-200/90 space-y-1.5 sm:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Pengguna HR baru akan memiliki akses ke fitur manajemen rekrutmen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Mereka dapat melihat, membuat, dan mengelola aplikasi kandidat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Pengguna HR tidak dapat membuat pengguna lain (hanya hak admin)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Pengguna baru akan menerima kredensial login melalui email yang diberikan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthGuard(CreateUser);
