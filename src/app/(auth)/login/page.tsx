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
          title: 'Login Successful!',
          text: 'Welcome back to your HR management platform',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#ffffff',
          customClass: {
            popup: 'rounded-xl border border-slate-700'
          }
        });
        
        // Redirect to the dashboard
        router.push("/dashboard");
      } else {
        // Authentication failed alert
        Swal.fire({
          title: 'Authentication Failed',
          text: 'Please try again.',
          icon: 'error',
          confirmButtonText: 'Try Again',
          background: '#1e293b',
          color: '#ffffff',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-xl border border-slate-700'
          }
        });
      }
    } catch (err: any) {
      // Error alert
      Swal.fire({
        title: 'Login Failed',
        text: err.message || 'An error occurred during login. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
        background: '#1e293b',
        color: '#ffffff',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-xl border border-slate-700'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <Image
                src="/logohrlogin.png"
                alt="HR Management Logo"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">Sign In</h1>
            <p className="text-slate-400 text-sm">
              Access your HR management platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-slate-400">
              Back to Homepage?{" "}
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Go to Homepage
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}