// Updated AnalyticsPage.tsx with improved loading, background, and responsive design
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  TrendingUp,
  Building,
  BarChart3,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  Filter,
  Layers,
} from "lucide-react";
import analyticsService, {
  DashboardStats,
  StatusBreakdown,
  PositionData,
  ProvinceData,
  AgeDistribution,
  EducationData,
  TrendData,
  FilterOptions,
} from "@/services/analytics.service";

// Import components
import StatCard from "@/components/analytics/StatCard";
import TabButton from "@/components/analytics/TabButton";
import ExportControls from "@/components/analytics/ExportControlls";
import {
  StatusChart,
  PositionChart,
  ProvinceChart,
  TrendChart,
  DemographicsChart,
} from "@/components/analytics/ChartComponent";
import { withAuthGuard } from "@/components/withGuard";

function AnalyticsPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statusData, setStatusData] = useState<StatusBreakdown[]>([]);
  const [positionData, setPositionData] = useState<PositionData[]>([]);
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [ageData, setAgeData] = useState<AgeDistribution[]>([]);
  const [educationData, setEducationData] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const [statusFilters, setStatusFilters] = useState<FilterOptions>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async (isManual = false) => {
    try {
      if (isManual) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      // Use Promise.allSettled to ensure resilient data loading
      const [
        dashboardRes,
        positionRes,
        provinceRes,
        trendRes,
        ageRes,
        educationRes,
      ] = await Promise.allSettled([
        analyticsService.getDashboardStats(),
        analyticsService.getApplicationsByPosition(),
        analyticsService.getApplicationsByProvince(),
        analyticsService.getApplicationsTrend(),
        analyticsService.getAgeDistribution(),
        analyticsService.getApplicationsByEducation(),
      ]);

      if (dashboardRes.status === "fulfilled") {
        setDashboardStats(dashboardRes.value);
      }

      if (positionRes.status === "fulfilled") {
        const formattedPositions = (positionRes.value || []).map((item) => ({
          ...item,
          position: item.position?.replace(/_/g, " ") || "Tidak Diketahui",
        }));
        setPositionData(formattedPositions);
      }

      if (provinceRes.status === "fulfilled") {
        setProvinceData((provinceRes.value || []).slice(0, 10));
      }

      if (trendRes.status === "fulfilled") {
        setTrendData(trendRes.value || []);
      }

      if (ageRes.status === "fulfilled") {
        setAgeData(ageRes.value || []);
      }

      if (educationRes.status === "fulfilled") {
        setEducationData(educationRes.value || []);
      }

      // Fetch status data separately to allow for status filtering
      await fetchStatusData();
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchStatusData = useCallback(async (filters?: FilterOptions) => {
    try {
      const statusResponse = await analyticsService.getApplicationsByStatus(filters);
      setStatusData(statusResponse || []);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  }, []);

  const handleStatusFiltersChange = useCallback(
    (newFilters: FilterOptions) => {
      setStatusFilters(newFilters);
      fetchStatusData(newFilters);
    },
    [fetchStatusData]
  );

  // Safely sort positions for insights
  const sortedPositions = useMemo(() => {
    return [...positionData].sort((a, b) => b.count - a.count);
  }, [positionData]);

  // Safely sort provinces for insights
  const sortedProvinces = useMemo(() => {
    return [...provinceData].sort((a, b) => b.count - a.count);
  }, [provinceData]);

  // Calculate In Progress total count
  const inProgressCount = useMemo(() => {
    return (
      (dashboardStats?.onProgressApplications || 0) +
      (dashboardStats?.interviewApplications || 0) +
      (dashboardStats?.psikotestApplications || 0) +
      (dashboardStats?.userinterviewApplications || 0) +
      (dashboardStats?.medicalcheckupApplications || 0) +
      (dashboardStats?.medicalfollowupApplications || 0)
    );
  }, [dashboardStats]);

  // Key Rates
  const hireRate = useMemo(() => {
    if (!dashboardStats?.totalApplications) return 0;
    return Math.round(
      (dashboardStats.hiredApplications / dashboardStats.totalApplications) * 100
    );
  }, [dashboardStats]);

  const rejectRate = useMemo(() => {
    if (!dashboardStats?.totalApplications || !dashboardStats?.rejectedApplications) return 0;
    return Math.round(
      (dashboardStats.rejectedApplications / dashboardStats.totalApplications) * 100
    );
  }, [dashboardStats]);

  // Prepare export data
  const exportData = {
    dashboardStats,
    statusData,
    positionData,
    provinceData,
    trendData,
    ageData,
    educationData,
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "status":
        return (
          <StatusChart
            data={statusData}
            positions={positionData}
            onFiltersChange={handleStatusFiltersChange}
          />
        );
      case "trend":
        return <TrendChart data={trendData} />;
      case "positions":
        return <PositionChart data={positionData} />;
      case "province":
        return <ProvinceChart data={provinceData} />;
      case "demographics":
        return (
          <DemographicsChart ageData={ageData} educationData={educationData} />
        );
      default:
        return (
          <StatusChart
            data={statusData}
            positions={positionData}
            onFiltersChange={handleStatusFiltersChange}
          />
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 relative min-h-[400px]">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-slate-800/90 to-gray-800/90 rounded-2xl border border-slate-600/30 shadow-2xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full border-4 border-blue-500/20"></div>
            </div>
            <div className="text-center">
              <p className="text-white text-lg sm:text-xl font-semibold mb-2">
                Memuat Analitik...
              </p>
              <p className="text-gray-400 text-sm">
                Mengumpulkan wawasan rekrutmen yang komprehensif
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-400" />
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                Dashboard Analitik
              </span>
            </h1>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Live Insights
            </span>
          </div>
          <p className="text-sm sm:text-base text-gray-400">
            Wawasan rekrutmen komprehensif, metrik konversi, dan tren performa
          </p>
          {lastUpdated && (
            <p className="text-xs text-slate-500">
              Terakhir diperbarui: {lastUpdated.toLocaleTimeString("id-ID")} WIB
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => fetchAnalyticsData(true)}
            disabled={loading || isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs sm:text-sm font-medium rounded-xl transition-all shadow-md disabled:opacity-50"
            title="Segarkan data analitik"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-400" : "text-slate-400"}`}
            />
            <span className="hidden sm:inline">Segarkan</span>
          </button>
          <ExportControls data={exportData} />
        </div>
      </div>

      {/* Stats Grid - 6 Key Balanced Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Aplikasi"
          value={dashboardStats?.totalApplications || 0}
          icon={Users}
          description="Seluruh aplikasi masuk"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Aplikasi Tertunda"
          value={dashboardStats?.pendingApplications || 0}
          icon={Clock}
          description="Menunggu review awal"
          gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Sedang Diproses"
          value={inProgressCount}
          icon={UserCheck}
          description="Psikotest, Interview, MCU"
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Aplikasi Diterima (Hired)"
          value={dashboardStats?.hiredApplications || 0}
          icon={CheckCircle}
          description={`Tingkat kelulusan: ${hireRate}%`}
          gradient="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <StatCard
          title="Aplikasi Ditolak (Rejected)"
          value={dashboardStats?.rejectedApplications || 0}
          icon={UserX}
          description={`Tingkat penolakan: ${rejectRate}%`}
          gradient="bg-gradient-to-br from-red-500 to-rose-600"
        />
        <StatCard
          title="Aplikasi Terbaru"
          value={dashboardStats?.recentApplications || 0}
          icon={TrendingUp}
          description="Masuk dalam 7 hari terakhir"
          gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
        />
      </div>

      {/* Charts Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 p-4 sm:p-6">
        {/* Tab Navigation with Trend Chart included */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 p-1 bg-gray-700/50 rounded-lg sm:rounded-xl">
          <TabButton
            id="status"
            label="Ringkasan Status"
            isActive={activeTab === "status"}
            onClick={setActiveTab}
          />
          <TabButton
            id="trend"
            label="Tren Waktu (30 Hari)"
            isActive={activeTab === "trend"}
            onClick={setActiveTab}
          />
          <TabButton
            id="positions"
            label="Posisi Teratas"
            isActive={activeTab === "positions"}
            onClick={setActiveTab}
          />
          <TabButton
            id="province"
            label="Distribusi Geografis"
            isActive={activeTab === "province"}
            onClick={setActiveTab}
          />
          <TabButton
            id="demographics"
            label="Demografi Pelamar"
            isActive={activeTab === "demographics"}
            onClick={setActiveTab}
          />
        </div>

        {/* Chart Content */}
        <div className="min-h-[400px]">{renderActiveTab()}</div>
      </div>

      {/* Recruitment Funnel & Quick Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Wawasan Cepat Card */}
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Wawasan Cepat
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3.5 bg-blue-900/30 border border-blue-700/50 rounded-xl backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-gray-300">
                Posisi Paling Banyak Dilamar
              </span>
              <span className="font-semibold text-blue-400 text-xs sm:text-sm">
                {sortedPositions[0]?.position || "N/A"}
                {sortedPositions[0]?.count ? ` (${sortedPositions[0].count})` : ""}
              </span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-emerald-900/30 border border-emerald-700/50 rounded-xl backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-gray-300">Provinsi Pelamar Terbanyak</span>
              <span className="font-semibold text-emerald-400 text-xs sm:text-sm">
                {sortedProvinces[0]?.province?.replace(/_/g, " ") || "N/A"}
                {sortedProvinces[0]?.count ? ` (${sortedProvinces[0].count})` : ""}
              </span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-purple-900/30 border border-purple-700/50 rounded-xl backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-gray-300">Rasio Diterima (Hire Rate)</span>
              <span className="font-semibold text-purple-400 text-xs sm:text-sm">
                {hireRate}% dari total pelamar
              </span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-rose-900/30 border border-rose-700/50 rounded-xl backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-gray-300">Rasio Gugur (Rejection Rate)</span>
              <span className="font-semibold text-rose-400 text-xs sm:text-sm">
                {rejectRate}% dari total pelamar
              </span>
            </div>
          </div>
        </div>

        {/* Recruitment Pipeline Funnel Card */}
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Corong Rekrutmen (Pipeline Funnel)
          </h3>
          <div className="space-y-4">
            {/* Step 1: Total Masuk */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">1. Total Aplikasi Masuk</span>
                <span className="text-white font-bold">{dashboardStats?.totalApplications || 0} (100%)</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500 w-full" />
              </div>
            </div>

            {/* Step 2: Sedang Diproses */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">2. Tahap Seleksi & Review</span>
                <span className="text-indigo-400 font-bold">
                  {inProgressCount + (dashboardStats?.pendingApplications || 0)}{" "}
                  ({dashboardStats?.totalApplications
                    ? Math.round(
                        ((inProgressCount + (dashboardStats?.pendingApplications || 0)) /
                          dashboardStats.totalApplications) *
                          100
                      )
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      dashboardStats?.totalApplications
                        ? Math.round(
                            ((inProgressCount + (dashboardStats?.pendingApplications || 0)) /
                              dashboardStats.totalApplications) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Step 3: Diterima */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">3. Diterima (Hired / Completed)</span>
                <span className="text-emerald-400 font-bold">
                  {dashboardStats?.hiredApplications || 0} ({hireRate}%)
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${hireRate}%`,
                  }}
                />
              </div>
            </div>

            {/* Step 4: Ditolak */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">4. Ditolak (Rejected)</span>
                <span className="text-rose-400 font-bold">
                  {dashboardStats?.rejectedApplications || 0} ({rejectRate}%)
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${rejectRate}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthGuard(AnalyticsPage);
