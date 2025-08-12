import api from './api';

// Types for analytics data
export interface OverallStats {
  applications: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  users: number;
  recruiters: number;
}

export interface PositionStats {
  position: string;
  count: number;
}

export interface ProvinceStats {
  province: string;
  count: number;
}

export interface ExperienceStats {
  experienceLevel: string;
  count: number;
}

export interface EducationStats {
  education: string;
  count: number;
}

export interface MonthlyTrend {
  month: number;
  monthName: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface RecentApplication {
  id: string;
  fullName: string;
  appliedPosition: string;
  province: string;
  status: string;
  createdAt: string;
}

export interface AgeDistribution {
  ageRange: string;
  count: number;
}

export interface DashboardData {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  topPositions: PositionStats[];
  topProvinces: ProvinceStats[];
  monthlyTrends: {
    month: number;
    monthName: string;
    count: number;
  }[];
  recentApplications: {
    id: string;
    fullName: string;
    appliedPosition: string;
    status: string;
    createdAt: string;
  }[];
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  stats?: T;
  dashboard?: T;
  year?: number;
}

export class AnalyticsService {
  // Get overall recruitment statistics
  static async getOverallStats(): Promise<OverallStats> {
    try {
      const response = await api.get('/analytics/stats');
      return response.data.stats;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch overall statistics');
    }
  }

  // Get applications grouped by position
  static async getApplicationsByPosition(): Promise<PositionStats[]> {
    try {
      const response = await api.get('/analytics/positions');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications by position');
    }
  }

  // Get applications grouped by province
  static async getApplicationsByProvince(): Promise<ProvinceStats[]> {
    try {
      const response = await api.get('/analytics/provinces');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications by province');
    }
  }

  // Get applications grouped by experience level
  static async getApplicationsByExperience(): Promise<ExperienceStats[]> {
    try {
      const response = await api.get('/analytics/experience');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications by experience');
    }
  }

  // Get applications grouped by education level
  static async getApplicationsByEducation(): Promise<EducationStats[]> {
    try {
      const response = await api.get('/analytics/education');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications by education');
    }
  }

  // Get monthly application trends
  static async getMonthlyTrends(year?: number): Promise<{ year: number; data: MonthlyTrend[] }> {
    try {
      const params = year ? { year } : {};
      const response = await api.get('/analytics/trends', { params });
      return {
        year: response.data.year,
        data: response.data.data
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch monthly trends');
    }
  }

  // Get recent applications
  static async getRecentApplications(limit?: number): Promise<RecentApplication[]> {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/analytics/recent', { params });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recent applications');
    }
  }

  // Get age distribution
  static async getAgeDistribution(): Promise<AgeDistribution[]> {
    try {
      const response = await api.get('/analytics/age-distribution');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch age distribution');
    }
  }

  // Get comprehensive dashboard data
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data.dashboard;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }

  // Utility method to format position names for display
  static formatPositionName(position: string): string {
    return position
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Utility method to format province names for display
  static formatProvinceName(province: string): string {
    return province
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Utility method to calculate completion rate
  static calculateCompletionRate(stats: OverallStats): number {
    if (stats.applications.total === 0) return 0;
    return Math.round((stats.applications.completed / stats.applications.total) * 100);
  }

  // Utility method to calculate progress rate
  static calculateProgressRate(stats: OverallStats): number {
    if (stats.applications.total === 0) return 0;
    const inProgressAndCompleted = stats.applications.inProgress + stats.applications.completed;
    return Math.round((inProgressAndCompleted / stats.applications.total) * 100);
  }

  // Utility method to get status color for UI
  static getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return '#f59e0b'; // yellow
      case 'ON_PROGRESS':
        return '#3b82f6'; // blue
      case 'COMPLETED':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  }

  // Utility method to format numbers with commas
  static formatNumber(num: number): string {
    return num.toLocaleString();
  }

  // Utility method to get trend direction
  static getTrendDirection(data: MonthlyTrend[], monthsToCompare: number = 2): 'up' | 'down' | 'stable' {
    if (data.length < monthsToCompare) return 'stable';
    
    const recent = data.slice(-monthsToCompare);
    const current = recent[recent.length - 1]?.total || 0;
    const previous = recent[0]?.total || 0;
    
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }

  // Utility method to validate year parameter
  static validateYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= 2020 && year <= currentYear + 1;
  }
}