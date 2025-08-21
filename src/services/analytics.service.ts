import api from './api';

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  onProgressApplications: number;
  hiredApplications: number;
  totalRecruiters: number;
  recentApplications: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface PositionData {
  position: string;
  count: number;
}

export interface ProvinceData {
  province: string;
  count: number;
}

export interface EducationData {
  education: string;
  count: number;
}

export interface ExperienceData {
  experienceLevel: string;
  count: number;
}

export interface MaritalStatusData {
  maritalStatus: string;
  count: number;
}

export interface AgeDistribution {
  ageRange: string;
  count: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface DepartmentData {
  department: string;
  count: number;
}

export interface CustomAnalyticsParams {
  startDate: string;
  endDate: string;
  metric: 'applications_by_status' | 'applications_by_position' | 'applications_by_province';
}

export interface FilterOptions {
  position?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

class AnalyticsService {
  // Dashboard overview
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  }

  // Applications breakdowns with optional filters
  async getApplicationsByStatus(filters?: FilterOptions): Promise<StatusBreakdown[]> {
    const params: any = {};
    
    if (filters?.position && filters.position !== 'all') {
      params.position = filters.position;
    }
    if (filters?.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters?.endDate) {
      params.endDate = filters.endDate;
    }

    const response = await api.get('/analytics/applications/status', { params });
    return response.data;
  }

  async getApplicationsByPosition(): Promise<PositionData[]> {
    const response = await api.get('/analytics/applications/position');
    return response.data;
  }

  async getApplicationsByProvince(): Promise<ProvinceData[]> {
    const response = await api.get('/analytics/applications/province');
    return response.data;
  }

  async getApplicationsByEducation(): Promise<EducationData[]> {
    const response = await api.get('/analytics/applications/education');
    return response.data;
  }

  async getApplicationsByExperience(): Promise<ExperienceData[]> {
    const response = await api.get('/analytics/applications/experience');
    return response.data;
  }

  async getApplicationsByMaritalStatus(): Promise<MaritalStatusData[]> {
    const response = await api.get('/analytics/applications/marital-status');
    return response.data;
  }

  async getAgeDistribution(): Promise<AgeDistribution[]> {
    const response = await api.get('/analytics/applications/age-distribution');
    return response.data;
  }

  // Trend analysis
  async getApplicationsTrend(): Promise<TrendData[]> {
    const response = await api.get('/analytics/applications/trend');
    return response.data;
  }

  // Recruiter analytics
  async getRecruitersByDepartment(): Promise<DepartmentData[]> {
    const response = await api.get('/analytics/recruiters/department');
    return response.data;
  }

  // Custom analytics
  async getCustomAnalytics(params: CustomAnalyticsParams): Promise<any> {
    const response = await api.get('/analytics/custom', { params });
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;