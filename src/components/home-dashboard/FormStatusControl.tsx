"use client";
import React, { useState, useEffect } from "react";
import { FormSettingsService, FormSettings } from "@/services/form-settings.service";
import { useAuth } from "@/context/useAuth";
import { Lock, Unlock, Loader2, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

const FormStatusControl: React.FC = () => {
  const { user } = useAuth();
  const [formSettings, setFormSettings] = useState<FormSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is HR, ADMIN, or MANAGEMENT
  const canView = user?.role === "HR" || user?.role === "ADMIN" || user?.role === "MANAGEMENT";

  useEffect(() => {
    if (canView) {
      fetchFormSettings();
    }
  }, [canView]);

  const fetchFormSettings = async () => {
    try {
      setLoading(true);
      const response = await FormSettingsService.getFormSettings();
      setFormSettings(response.formSettings);
    } catch (error) {
      console.error("Error fetching form settings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!canView) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-r from-slate-800/80 via-gray-800/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600/30 shadow-xl">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-300">Memuat status form...</span>
        </div>
      </div>
    );
  }

  const isOpen = formSettings?.isFormOpen ?? true;
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-600/30 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 w-full sm:w-auto">
          <div
            className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${
              isOpen
                ? "bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/30"
                : "bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-400/30"
            }`}
          >
            {isOpen ? (
              <Unlock className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            ) : (
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1">
              Status Form Recruitment
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              {isOpen
                ? "Form saat ini terbuka untuk publik"
                : "Form saat ini ditutup"}
            </p>
            {isOpen && formSettings?.dueDate && (
              <p className="text-xs text-yellow-400 mt-1">
                Akan ditutup pada: {formatDate(formSettings.dueDate)}
              </p>
            )}
            {isOpen && formSettings?.reason && (
              <p className="text-xs text-gray-400 mt-1">
                Alasan: {formSettings.reason}
              </p>
            )}
            {isOpen && formSettings?.openPositions && formSettings.openPositions.length > 0 && (
              <p className="text-xs text-blue-400 mt-1">
                Posisi terbuka: {formSettings.openPositions.length} posisi
              </p>
            )}
            {isOpen && formSettings?.openPositions && formSettings.openPositions.length === 0 && (
              <p className="text-xs text-green-400 mt-1">
                Semua posisi terbuka
              </p>
            )}
            {formSettings?.updatedBy && (
              <p className="text-xs text-gray-500 mt-1">
                Terakhir diupdate oleh: {formSettings.updatedBy.name}
              </p>
            )}
          </div>
        </div>
        <Link
          href="/dashboard/form-management"
          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Kelola Form</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default FormStatusControl;
