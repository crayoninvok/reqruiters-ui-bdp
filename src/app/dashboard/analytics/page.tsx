// Updated AnalyticsPage.tsx with improved loading, background, and responsive design
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  Building,
  BarChart3,
  Sparkles,
} from "lucide-react";
import analyticsService, {
  DashboardStats,
  StatusBreakdown,
  PositionData,
  ProvinceData,
  AgeDistribution,
  EducationData,
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
  DemographicsChart,
} from "@/components/analytics/ChartComponent";
import { withAuthGuard } from "@/components/withGuard";

function AnalyticsPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [statusData, setStatusData] = useState<StatusBreakdown[]>([]);
  const [positionData, setPositionData] = useState<PositionData[]>([]);
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [ageData, setAgeData] = useState<AgeDistribution[]>([]);
  const [educationData, setEducationData] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("status");
  const [statusFilters, setStatusFilters] = useState<FilterOptions>({});

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [
        dashboardResponse,
        positionResponse,
        provinceResponse,
        ageResponse,
        educationResponse,
      ] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getApplicationsByPosition(),
        analyticsService.getApplicationsByProvince(),
        analyticsService.getAgeDistribution(),
        analyticsService.getApplicationsByEducation(),
      ]);

      setDashboardStats(dashboardResponse);

      // Format position names for better display
      const formattedPositions = positionResponse.map((item) => ({
        ...item,
        position: item.position?.replace(/_/g, " ") || "Tidak Diketahui",
      }));
      setPositionData(formattedPositions);
      setProvinceData(provinceResponse.slice(0, 10));
      setAgeData(ageResponse);
      setEducationData(educationResponse);

      // Fetch status data separately to allow for filtering
      await fetchStatusData();
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusData = useCallback(async (filters?: FilterOptions) => {
    try {
      const statusResponse = await analyticsService.getApplicationsByStatus(
        filters
      );
      setStatusData(statusResponse);
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

  // Prepare export data
  const exportData = {
    dashboardStats,
    statusData,
    positionData,
    provinceData,
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
      {/* Improved Loading Overlay */}
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
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-400" />
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Dashboard Analitik
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Wawasan rekrutmen yang komprehensif dan metrik kinerja
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <ExportControls data={exportData} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Aplikasi"
          value={dashboardStats?.totalApplications || 0}
          icon={Users}
          description="Aplikasi sepanjang masa"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Aplikasi Tertunda"
          value={dashboardStats?.pendingApplications || 0}
          icon={Clock}
          description="Menunggu review"
          gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Sedang Diproses"
          value={
            (dashboardStats?.onProgressApplications || 0) +
            (dashboardStats?.interviewApplications || 0) +
            (dashboardStats?.psikotestApplications || 0) +
            (dashboardStats?.userinterviewApplications || 0) +
            (dashboardStats?.medicalcheckupApplications || 0) +
            (dashboardStats?.medicalfollowupApplications || 0)
          }
          icon={UserCheck}
          description="Sedang diproses"
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Aplikasi yang Diterima"
          value={dashboardStats?.hiredApplications || 0}
          icon={CheckCircle}
          description="Aplikasi yang diselesaikan"
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Total Perekrut"
          value={dashboardStats?.totalRecruiters || 0}
          icon={Building}
          description="Perekrut aktif"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Aplikasi Terbaru"
          value={dashboardStats?.recentApplications || 0}
          icon={TrendingUp}
          description="7 hari terakhir"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Charts Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 p-4 sm:p-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 p-1 bg-gray-700/50 rounded-lg sm:rounded-xl">
          <TabButton
            id="status"
            label="Ringkasan Status"
            isActive={activeTab === "status"}
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
            label="Geografis"
            isActive={activeTab === "province"}
            onClick={setActiveTab}
          />
          <TabButton
            id="demographics"
            label="Demografi"
            isActive={activeTab === "demographics"}
            onClick={setActiveTab}
          />
        </div>

        {/* Chart Content */}
        <div className="min-h-[400px]">{renderActiveTab()}</div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Wawasan Cepat
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-gray-300">
                Posisi Paling Populer
              </span>
              <span className="font-medium text-blue-400 text-xs sm:text-sm">
                {positionData[0]?.position || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-900/30 border border-green-700/50 rounded-lg backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-gray-300">Provinsi Teratas</span>
              <span className="font-medium text-green-400 text-xs sm:text-sm">
                {provinceData[0]?.province || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-gray-300">Tingkat Keberhasilan</span>
              <span className="font-medium text-purple-400 text-xs sm:text-sm">
                {dashboardStats?.totalApplications
                  ? Math.round(
                      (dashboardStats.hiredApplications /
                        dashboardStats.totalApplications) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-600/30 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Metrik Kinerja
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-300">
                Aplikasi yang Sedang Diproses
              </span>
                <span className="text-xs sm:text-sm font-medium text-white">
                  {(dashboardStats?.onProgressApplications || 0) +
                    (dashboardStats?.psikotestApplications || 0) +
                    (dashboardStats?.interviewApplications || 0) +
                    (dashboardStats?.userinterviewApplications || 0) +
                    (dashboardStats?.medicalcheckupApplications || 0) +
                    (dashboardStats?.medicalfollowupApplications || 0)}{" "}
                  / {dashboardStats?.totalApplications || 0}
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      dashboardStats?.totalApplications
                        ? Math.round(
                            (((dashboardStats?.onProgressApplications || 0) +
                              (dashboardStats?.hiredApplications || 0)) /
                              dashboardStats.totalApplications) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-300">Tingkat Penyelesaian</span>
                <span className="text-xs sm:text-sm font-medium text-white">
                  {dashboardStats?.totalApplications
                    ? Math.round(
                        (dashboardStats.hiredApplications /
                          dashboardStats.totalApplications) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      dashboardStats?.totalApplications
                        ? Math.round(
                            (dashboardStats.hiredApplications /
                              dashboardStats.totalApplications) *
                              100
                          )
                        : 0
                    }%`,
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
