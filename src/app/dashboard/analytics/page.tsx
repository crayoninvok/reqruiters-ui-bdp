// Updated AnalyticsPage.tsx with filter support
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, Clock, CheckCircle, TrendingUp, Building } from 'lucide-react';
import analyticsService, { 
  DashboardStats, 
  StatusBreakdown, 
  PositionData, 
  ProvinceData, 
  TrendData,
  AgeDistribution,
  EducationData,
  FilterOptions
} from '@/services/analytics.service';

// Import components
import StatCard from '@/components/analytics/StatCard';
import TabButton from '@/components/analytics/TabButton';
import ExportControls from '@/components/analytics/ExportControlls';
import { 
  StatusChart, 
  PositionChart, 
  ProvinceChart, 
  TrendChart, 
  DemographicsChart 
} from '@/components/analytics/ChartComponent';
import { withAuthGuard } from '@/components/withGuard';

function AnalyticsPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statusData, setStatusData] = useState<StatusBreakdown[]>([]);
  const [positionData, setPositionData] = useState<PositionData[]>([]);
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [ageData, setAgeData] = useState<AgeDistribution[]>([]);
  const [educationData, setEducationData] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('status');
  const [statusFilters, setStatusFilters] = useState<FilterOptions>({});

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [
        dashboardResponse,
        positionResponse,
        provinceResponse,
        trendResponse,
        ageResponse,
        educationResponse
      ] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getApplicationsByPosition(),
        analyticsService.getApplicationsByProvince(),
        analyticsService.getApplicationsTrend(),
        analyticsService.getAgeDistribution(),
        analyticsService.getApplicationsByEducation()
      ]);

      setDashboardStats(dashboardResponse);
      
      // Format position names for better display
      const formattedPositions = positionResponse.map(item => ({
        ...item,
        position: item.position?.replace(/_/g, ' ') || 'Unknown'
      }));
      setPositionData(formattedPositions);
      setProvinceData(provinceResponse.slice(0, 10));
      setTrendData(trendResponse);
      setAgeData(ageResponse);
      setEducationData(educationResponse);

      // Fetch status data separately to allow for filtering
      await fetchStatusData();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusData = useCallback(async (filters?: FilterOptions) => {
    try {
      const statusResponse = await analyticsService.getApplicationsByStatus(filters);
      setStatusData(statusResponse);
    } catch (error) {
      console.error('Error fetching status data:', error);
    }
  }, []);

  const handleStatusFiltersChange = useCallback((newFilters: FilterOptions) => {
    setStatusFilters(newFilters);
    fetchStatusData(newFilters);
  }, [fetchStatusData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-center text-gray-600 dark:text-gray-300">Loading analytics...</div>
        </div>
      </div>
    );
  }

  // Prepare export data
  const exportData = {
    dashboardStats,
    statusData,
    positionData,
    provinceData,
    trendData,
    ageData,
    educationData
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'status':
        return (
          <StatusChart 
            data={statusData} 
            positions={positionData}
            onFiltersChange={handleStatusFiltersChange}
          />
        );
      case 'positions':
        return <PositionChart data={positionData} />;
      case 'provinces':
        return <ProvinceChart data={provinceData} />;
      case 'trends':
        return <TrendChart data={trendData} />;
      case 'demographics':
        return <DemographicsChart ageData={ageData} educationData={educationData} />;
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Comprehensive recruitment insights and performance metrics</p>
        </div>
        <ExportControls data={exportData} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Applications"
          value={dashboardStats?.totalApplications || 0}
          icon={Users}
          description="All time applications"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Pending Applications"
          value={dashboardStats?.pendingApplications || 0}
          icon={Clock}
          description="Awaiting review"
          gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="In Progress"
          value={dashboardStats?.onProgressApplications || 0}
          icon={UserCheck}
          description="Currently processing"
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Completed"
          value={dashboardStats?.completedApplications || 0}
          icon={CheckCircle}
          description="Finalized applications"
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Total Recruiters"
          value={dashboardStats?.totalRecruiters || 0}
          icon={Building}
          description="Active recruiters"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Recent Applications"
          value={dashboardStats?.recentApplications || 0}
          icon={TrendingUp}
          description="Last 7 days"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Charts Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <TabButton id="status" label="Status Overview" isActive={activeTab === 'status'} onClick={setActiveTab} />
          <TabButton id="positions" label="Top Positions" isActive={activeTab === 'positions'} onClick={setActiveTab} />
          <TabButton id="provinces" label="Geographic" isActive={activeTab === 'provinces'} onClick={setActiveTab} />
          <TabButton id="trends" label="Trends" isActive={activeTab === 'trends'} onClick={setActiveTab} />
          <TabButton id="demographics" label="Demographics" isActive={activeTab === 'demographics'} onClick={setActiveTab} />
        </div>

        {/* Chart Content */}
        <div className="min-h-[400px]">
          {renderActiveTab()}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Most Popular Position</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {positionData[0]?.position || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Top Province</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {provinceData[0]?.province || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Success Rate</span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {dashboardStats?.totalApplications 
                  ? Math.round((dashboardStats.completedApplications / dashboardStats.totalApplications) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Applications Processed</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {((dashboardStats?.onProgressApplications || 0) + (dashboardStats?.completedApplications || 0))} / {dashboardStats?.totalApplications || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${dashboardStats?.totalApplications 
                      ? Math.round((((dashboardStats?.onProgressApplications || 0) + (dashboardStats?.completedApplications || 0)) / dashboardStats.totalApplications) * 100)
                      : 0}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Completion Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dashboardStats?.totalApplications 
                    ? Math.round((dashboardStats.completedApplications / dashboardStats.totalApplications) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${dashboardStats?.totalApplications 
                      ? Math.round((dashboardStats.completedApplications / dashboardStats.totalApplications) * 100)
                      : 0}%`
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