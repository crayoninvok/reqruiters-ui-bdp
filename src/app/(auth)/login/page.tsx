"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { LoginCredentials } from "@/types/types";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
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
        // Success alert
        await Swal.fire({
          title: "Login Successful!",
          text: "Welcome back to your HR management platform",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1e293b",
          color: "#ffffff",
          customClass: {
            popup: "rounded-xl border border-slate-700",
          },
        });

        // Redirect to the dashboard
        router.push("/dashboard");
      } else {
        // Authentication failed alert
        Swal.fire({
          title: "Authentication Failed",
          text: "Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
          background: "#1e293b",
          color: "#ffffff",
          confirmButtonColor: "#dc2626",
          customClass: {
            popup: "rounded-xl border border-slate-700",
          },
        });
      }
    } catch (err: any) {
      // Error alert
      Swal.fire({
        title: "Login Failed",
        text:
          err.message || "An error occurred during login. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
        background: "#1e293b",
        color: "#ffffff",
        confirmButtonColor: "#dc2626",
        customClass: {
          popup: "rounded-xl border border-slate-700",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Photo Card Section */}
          <div className="hidden lg:block">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="relative overflow-hidden rounded-xl mb-6 group">
                <Image
                  src="/hr.avif"
                  alt="HR Management Team"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Human Resources Excellence
                  </h2>
                  <p className="text-slate-200 text-sm">
                    Empowering teams, streamlining processes, driving success
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      Employee Management
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Comprehensive staff oversight
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      Analytics & Reports
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Data-driven insights
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      Automated Workflows
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Streamlined operations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="mb-6">
                  <Image
                    src="/logohrlogin.png"
                    alt="HR Management Logo"
                    width={120}
                    height={120}
                    className="mx-auto drop-shadow-lg"
                  />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-slate-400 text-sm">
                  Sign in to access your HR management platform
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 backdrop-blur-sm"
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your password"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-600 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-slate-400">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="text-center">
                  <span className="text-sm text-slate-400">
                    Need to go back?{" "}
                    <Link
                      href="/"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
                    >
                      Return to Homepage
                    </Link>
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Photo Card */}
            <div className="lg:hidden mt-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src="/hr.avif"
                    alt="HR Management Team"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-semibold text-white">
                      Professional HR Solutions
                    </h3>
                    <p className="text-slate-200 text-xs">
                      Your trusted partner in human resources
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
