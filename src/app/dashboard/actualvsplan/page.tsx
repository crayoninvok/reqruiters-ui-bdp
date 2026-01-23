"use client";
import React, { useState, useEffect } from "react";
import {
  ActualVsPlanService,
  ActualVsPlanData,
  DepartmentSummary,
  PlanData,
} from "@/services/actualvsplan.service";
import { withGuard } from "@/components/withGuard";
import { useAuth } from "@/context/useAuth";
import { Department, Position } from "@/types/types";
import Swal from "sweetalert2";
import { BarChart3, TrendingUp, TrendingDown, Target, RefreshCw, Download, Plus, X, Trash2, Save } from "lucide-react";

function ActualVsPlanPage() {
  const { user } = useAuth();
  const [actualVsPlanData, setActualVsPlanData] = useState<ActualVsPlanData[]>(
    []
  );
  const [departmentSummary, setDepartmentSummary] = useState<
    DepartmentSummary[]
  >([]);
  const [summary, setSummary] = useState({
    totalPlanned: 0,
    totalActual: 0,
    totalVariance: 0,
    totalVariancePercentage: 0,
    status: "on-target" as "above" | "below" | "on-target",
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"detailed" | "department">("detailed");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planFormData, setPlanFormData] = useState<PlanData>({
    department: "" as Department,
    position: "" as Position,
    plannedCount: 0,
    targetDate: "",
  });
  const [planList, setPlanList] = useState<PlanData[]>([]);
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [actualVsPlan, deptSummary] = await Promise.all([
        ActualVsPlanService.getActualVsPlan(),
        ActualVsPlanService.getDepartmentSummary(),
      ]);

      setActualVsPlanData(actualVsPlan.data);
      setSummary(actualVsPlan.summary);
      setDepartmentSummary(deptSummary.data);

      // Extract plan list from actualVsPlan data
      const plans: PlanData[] = actualVsPlan.data.map((item) => ({
        department: item.department as Department,
        position: item.position as Position,
        plannedCount: item.planned,
        targetDate: new Date().toISOString().split("T")[0], // Default to today
      }));
      setPlanList(plans);
    } catch (error) {
      console.error("Error loading data:", error);
      Swal.fire({
        title: "Kesalahan",
        text: "Gagal memuat data aktual vs rencana",
        icon: "error",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = () => {
    setPlanFormData({
      department: "" as Department,
      position: "" as Position,
      plannedCount: 0,
      targetDate: "",
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = async () => {
    // Validate form
    const errors = ActualVsPlanService.validatePlanData([planFormData]);
    if (errors.length > 0) {
      Swal.fire({
        title: "Validation Error",
        html: errors.join("<br>"),
        icon: "error",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    // Check if plan with same department+position already exists
    const existingIndex = planList.findIndex(
      (p) =>
        p.department === planFormData.department &&
        p.position === planFormData.position
    );

    if (existingIndex >= 0) {
      Swal.fire({
        title: "Rencana Sudah Ada",
        text: "Rencana untuk departemen dan posisi ini sudah ada. Silakan perbarui di daftar rencana di bawah.",
        icon: "warning",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    try {
      setSavingPlan(true);

      // Add new plan to list
      const updatedPlans = [...planList, planFormData];

      // Save to backend
      await ActualVsPlanService.updatePlan(updatedPlans);

      Swal.fire({
        title: "Berhasil",
        text: "Rencana rekrutmen berhasil disimpan",
        icon: "success",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });

      setShowPlanModal(false);
      loadData(); // Reload data to reflect changes
    } catch (error: any) {
      console.error("Error saving plan:", error);
      Swal.fire({
        title: "Kesalahan",
        text:
          error.response?.data?.message || "Gagal menyimpan rencana rekrutmen",
        icon: "error",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } finally {
      setSavingPlan(false);
    }
  };

  const handleUpdateAllPlans = async () => {
    if (planList.length === 0) {
      Swal.fire({
        title: "Tidak Ada Rencana",
        text: "Silakan tambahkan minimal satu rencana sebelum menyimpan",
        icon: "warning",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    // Validate all plans
    const errors = ActualVsPlanService.validatePlanData(planList);
    if (errors.length > 0) {
      Swal.fire({
        title: "Validation Error",
        html: errors.join("<br>"),
        icon: "error",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    try {
      setSavingPlan(true);
      await ActualVsPlanService.updatePlan(planList);

      Swal.fire({
        title: "Berhasil",
        text: "Semua rencana rekrutmen berhasil disimpan",
        icon: "success",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });

      loadData(); // Reload data
    } catch (error: any) {
      console.error("Error updating plans:", error);
      Swal.fire({
        title: "Kesalahan",
        text:
          error.response?.data?.message || "Gagal memperbarui rencana rekrutmen",
        icon: "error",
        confirmButtonText: "Baik",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } finally {
      setSavingPlan(false);
    }
  };

  const handleRemovePlan = (index: number) => {
    Swal.fire({
      title: "Hapus Rencana?",
      text: "Apakah Anda yakin ingin menghapus rencana ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      background: "#1f2937",
      color: "#f9fafb",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedPlans = planList.filter((_, i) => i !== index);
        setPlanList(updatedPlans);
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "above":
        return <TrendingUp className="w-4 h-4 text-blue-400 inline" />;
      case "below":
        return <TrendingDown className="w-4 h-4 text-red-400 inline" />;
      default:
        return <Target className="w-4 h-4 text-green-400 inline" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2.5 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "above":
        return `${baseClasses} bg-blue-900/30 text-blue-300 border border-blue-700/50`;
      case "below":
        return `${baseClasses} bg-red-900/30 text-red-300 border border-red-700/50`;
      default:
        return `${baseClasses} bg-green-900/30 text-green-300 border border-green-700/50`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-slate-800/90 to-gray-800/90 rounded-2xl border border-slate-600/30 shadow-2xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full border-4 border-blue-500/20"></div>
            </div>
            <div className="text-center">
              <p className="text-white text-lg sm:text-xl font-semibold mb-2">
                Memuat Analisis...
              </p>
              <p className="text-gray-400 text-sm">
                Mengambil data aktual vs rencana
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-2">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                  Analisis Aktual vs Rencana
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              Bandingkan target rekrutmen yang direncanakan dengan data perekrutan aktual
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="text-xs sm:text-sm text-gray-400 mb-2">Total Rencana</div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {summary.totalPlanned}
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="text-xs sm:text-sm text-gray-400 mb-2">Total Aktual</div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {summary.totalActual}
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="text-xs sm:text-sm text-gray-400 mb-2">Selisih</div>
          <div
            className={`text-2xl sm:text-3xl font-bold ${
              summary.totalVariance >= 0 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {summary.totalVariance >= 0 ? "+" : ""}
            {summary.totalVariance}
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="text-xs sm:text-sm text-gray-400 mb-2">Selisih %</div>
          <div
            className={`text-2xl sm:text-3xl font-bold ${
              summary.totalVariancePercentage >= 0
                ? "text-blue-400"
                : "text-red-400"
            }`}
          >
            {summary.totalVariancePercentage >= 0 ? "+" : ""}
            {summary.totalVariancePercentage}%
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-4 sm:p-5">
        <div className="flex space-x-1 bg-slate-700/50 rounded-lg p-1">
          <button
            onClick={() => setView("detailed")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              view === "detailed"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Tampilan Detail
          </button>
          <button
            onClick={() => setView("department")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              view === "department"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Ringkasan Departemen
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-600/30">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {view === "detailed" ? "Departemen / Posisi" : "Departemen"}
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rencana
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Aktual
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Selisih
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/50 divide-y divide-slate-600/30">
              {view === "detailed"
                ? actualVsPlanData.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {item.department}
                          </div>
                          <div className="text-sm text-gray-400">
                            {item.position}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                        {item.planned}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                        {item.actual}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(item.status)}
                          <span
                            className={
                              item.variance >= 0
                                ? "text-blue-400"
                                : "text-red-400"
                            }
                          >
                            {item.variance >= 0 ? "+" : ""}
                            {item.variance} ({item.variancePercentage >= 0 ? "+" : ""}
                            {item.variancePercentage}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(item.status)}>
                          {item.status === "above"
                            ? "Di Atas Target"
                            : item.status === "below"
                            ? "Di Bawah Target"
                            : "Sesuai Target"}
                        </span>
                      </td>
                    </tr>
                  ))
                : departmentSummary.map((dept, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {dept.department}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                        {dept.planned}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                        {dept.actual}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(dept.status)}
                          <span
                            className={
                              dept.variance >= 0
                                ? "text-blue-400"
                                : "text-red-400"
                            }
                          >
                            {dept.variance >= 0 ? "+" : ""}
                            {dept.variance} ({dept.variancePercentage >= 0 ? "+" : ""}
                            {dept.variancePercentage}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(dept.status)}>
                          {dept.status === "above"
                            ? "Di Atas Target"
                            : dept.status === "below"
                            ? "Di Bawah Target"
                            : "Sesuai Target"}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {user?.role === "ADMIN" && (
            <button
              onClick={handleAddPlan}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rencana</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-200 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center space-x-2 border border-slate-600/30"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Ulang Data</span>
          </button>
          <button
            onClick={() => {
              Swal.fire({
                title: "Info",
                text: "Fitur ekspor akan segera hadir!",
                icon: "info",
                confirmButtonText: "Baik",
                background: "#1f2937",
                color: "#f9fafb",
              });
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Laporan</span>
          </button>
        </div>
      </div>

      {/* Plan Management Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-600/30 p-5 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Tambah Rencana Rekrutmen
              </h2>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Departemen *
                </label>
                <select
                  value={planFormData.department}
                  onChange={(e) =>
                    setPlanFormData({
                      ...planFormData,
                      department: e.target.value as Department,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" className="bg-slate-700">Pilih Departemen</option>
                  {Object.values(Department).map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-700">
                      {dept.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Posisi *
                </label>
                <select
                  value={planFormData.position}
                  onChange={(e) =>
                    setPlanFormData({
                      ...planFormData,
                      position: e.target.value as Position,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" className="bg-slate-700">Pilih Posisi</option>
                  {Object.values(Position).map((pos) => (
                    <option key={pos} value={pos} className="bg-slate-700">
                      {pos.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Jumlah Rencana *
                </label>
                <input
                  type="number"
                  min="0"
                  value={planFormData.plannedCount}
                  onChange={(e) =>
                    setPlanFormData({
                      ...planFormData,
                      plannedCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Tanggal Target *
                </label>
                <input
                  type="date"
                  value={planFormData.targetDate}
                  onChange={(e) =>
                    setPlanFormData({
                      ...planFormData,
                      targetDate: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSavePlan}
                disabled={savingPlan}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {savingPlan ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Rencana</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan List Management (for ADMIN) */}
      {user?.role === "ADMIN" && planList.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Rencana Saat Ini
            </h3>
            <button
              onClick={handleUpdateAllPlans}
              disabled={savingPlan}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-2"
            >
              {savingPlan ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Semua Rencana</span>
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-600/30">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Departemen
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Posisi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Jumlah Rencana
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Tanggal Target
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/50 divide-y divide-slate-600/30">
                {planList.map((plan, index) => (
                  <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">
                      {plan.department.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {plan.position.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      <input
                        type="number"
                        min="0"
                        value={plan.plannedCount}
                        onChange={(e) => {
                          const updated = [...planList];
                          updated[index].plannedCount =
                            parseInt(e.target.value) || 0;
                          setPlanList(updated);
                        }}
                        className="w-20 px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      <input
                        type="date"
                        value={plan.targetDate}
                        onChange={(e) => {
                          const updated = [...planList];
                          updated[index].targetDate = e.target.value;
                          setPlanList(updated);
                        }}
                        className="px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleRemovePlan(index)}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default withGuard(ActualVsPlanPage, {
  allowedRoles: ["HR", "ADMIN", "MANAGEMENT", "VIEWS_ONLY"],
  unauthorizedRedirect: "/custom-401",
});
