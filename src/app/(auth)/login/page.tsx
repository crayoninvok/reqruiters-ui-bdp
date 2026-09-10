"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { LoginCredentials } from "@/types/types";
import Swal from "sweetalert2";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Home,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the login function from the useAuth hook
      await login(formData);

      // After login, store the token in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        // Success alert (Clean Light Corporate Theme)
        await Swal.fire({
          title: "Login Berhasil!",
          text: "Selamat datang kembali di platform HR PT Batara Dharma Persada",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#ffffff",
          color: "#0f172a",
          customClass: {
            popup: "rounded-2xl border border-slate-200 shadow-2xl",
          },
        });

        // Redirect to the dashboard
        router.push("/dashboard");
      } else {
        // Authentication failed alert
        Swal.fire({
          title: "Otentikasi Gagal",
          text: "Email atau kata sandi tidak sesuai. Silakan coba kembali.",
          icon: "error",
          confirmButtonText: "Coba Lagi",
          background: "#ffffff",
          color: "#0f172a",
          confirmButtonColor: "#0d9488",
          customClass: {
            popup: "rounded-2xl border border-slate-200 shadow-2xl",
            confirmButton: "rounded-xl font-bold px-6 py-2.5",
          },
        });
      }
    } catch (err: any) {
      // Error alert
      Swal.fire({
        title: "Login Gagal",
        text:
          err.message || "Terjadi kesalahan saat memproses login. Silakan periksa koneksi Anda dan coba lagi.",
        icon: "error",
        confirmButtonText: "Coba Lagi",
        background: "#ffffff",
        color: "#0f172a",
        confirmButtonColor: "#0d9488",
        customClass: {
          popup: "rounded-2xl border border-slate-200 shadow-2xl",
          confirmButton: "rounded-xl font-bold px-6 py-2.5",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-teal-500 selection:text-white">
      {/* Sisi Kiri: Visual & Branding (Split Screen) */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between p-12 xl:p-16 overflow-hidden min-h-screen bg-slate-900">
        {/* Background Image of HR Collaboration Team */}
        <img
          src="/hr.avif"
          alt="Human Resources Management PT Batara Dharma Persada"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient Overlays for High Legibility & Elegance */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-900/40"></div>
        <div className="absolute inset-0 bg-teal-950/20 mix-blend-multiply"></div>

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              PT Batara Dharma Persada
            </span>
          </div>
        </div>

        {/* Center / Editorial Hero Content */}
        <div className="relative z-10 space-y-6 max-w-xl my-auto py-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-extrabold uppercase tracking-wider">
              Human Resources &amp; Talent Center
            </div>
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-tight">
              Membangun Keunggulan Operasional Bersama Insan Terbaik
            </h1>
            <p className="text-slate-200 text-sm xl:text-base leading-relaxed font-normal">
              Sistem terintegrasi rekrutmen, penempatan karyawan, dan tata kelola sumber daya manusia untuk mendukung seluruh lini operasi pertambangan dan hauling PT Batara Dharma Persada.
            </p>
          </div>

          {/* 3 Core Value Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
            <div className="space-y-1">
              <div className="text-teal-300 font-extrabold text-base sm:text-lg">Terpadu</div>
              <div className="text-slate-300 text-xs leading-snug">Seleksi &amp; Evaluasi Formasi</div>
            </div>
            <div className="space-y-1">
              <div className="text-teal-300 font-extrabold text-base sm:text-lg">Real-Time</div>
              <div className="text-slate-300 text-xs leading-snug">Pelacakan Pipeline Pelamar</div>
            </div>
            <div className="space-y-1">
              <div className="text-teal-300 font-extrabold text-base sm:text-lg">Terpercaya</div>
              <div className="text-slate-300 text-xs leading-snug">Akses Berbasis Peran (RBAC)</div>
            </div>
          </div>
        </div>

        {/* Bottom Left Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10 font-medium">
          <span>© {new Date().getFullYear()} PT Batara Dharma Persada</span>
          <span>Human Capital Management</span>
        </div>
      </div>

      {/* Sisi Kanan: Form Login (Split Screen) */}
      <div className="w-full lg:w-1/2 xl:w-5/12 min-h-screen flex flex-col justify-between bg-white px-6 sm:px-12 xl:px-16 py-8 sm:py-12 relative">
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-teal-700 transition-colors group"
          >
            <Home className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            <span>Kembali ke Beranda</span>
          </Link>

          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            Portal Masuk
          </span>
        </div>

        {/* Center: Form Area */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-7">
          {/* Header & Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <Image
                src="/logohrlogin.png"
                alt="Logo HR Portal"
                width={60}
                height={60}
                className="w-14 h-14 object-contain flex-shrink-0"
                priority
              />
              <div>
                <div className="text-teal-700 font-extrabold text-xs uppercase tracking-wider">
                  PT Batara Dharma Persada
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Selamat Datang
                </h2>
              </div>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Silakan masukkan alamat email dan kata sandi Anda untuk mengakses dashboard manajemen HR.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Alamat Email Resmi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 shadow-xs transition-all"
                  placeholder="nama@bataramining.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-11 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 shadow-xs transition-all"
                  placeholder="Masukkan kata sandi akun Anda"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">Ingat Saya</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-teal-600/20 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses Masuk...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Note */}
        <div className="w-full max-w-md mx-auto pt-6 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
          Butuh bantuan akses akun? Hubungi Tim HRGA &amp; IT PT Batara Dharma Persada.
        </div>
      </div>
    </div>
  );
}
