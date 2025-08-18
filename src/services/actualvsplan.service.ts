import api from "./api";
import { ApiResponse } from "@/types/types";

export interface ActualVsPlanData {
  department: string;
  position: string;
  planned: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  status: 'above' | 'below' | 'on-target';
}

export interface ActualVsPlanSummary {
  totalPlanned: number;
  totalActual: number;
  totalVariance: number;
  totalVariancePercentage: number;
  status: 'above' | 'below' | 'on-target';
}

export interface ActualVsPlanResponse {
  message: string;
  summary: ActualVsPlanSummary;
  data: ActualVsPlanData[];
}

export interface DepartmentSummary {
  department: string;
  planned: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  status: 'above' | 'below' | 'on-target';
}

export interface DepartmentSummaryResponse {
  message: string;
  data: DepartmentSummary[];
}

export interface PlanData {
  department: string;
  position: string;
  plannedCount: number;
  targetDate: string;
}

export interface UpdatePlanRequest {
  planData: PlanData[];
}

export class ActualVsPlanService {
  private static getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  private static getAuthHeader() {
    const token = this.getCookie("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Generic retry logic
  private static async makeRequest<T>(
    requestFn: () => Promise<T>, 
    retries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error: any) {
        lastError = error;
        
        if (error.response?.status >= 400 && error.response?.status < 500) {
          if (error.response.status !== 408 && error.response.status !== 429) {
            throw error;
          }
        }
        
        if (attempt === retries) {
          throw lastError;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  }

  // Get actual vs plan comparison
  static async getActualVsPlan(): Promise<ActualVsPlanResponse> {
    return this.makeRequest(async () => {
      const response = await api.get("/actual-vs-plan", {
        headers: this.getAuthHeader(),
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Get department summary
  static async getDepartmentSummary(): Promise<DepartmentSummaryResponse> {
    return this.makeRequest(async () => {
      const response = await api.get("/actual-vs-plan/department-summary", {
        headers: this.getAuthHeader(),
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Update plan data (admin only)
  static async updatePlan(planData: PlanData[]): Promise<ApiResponse> {
    return this.makeRequest(async () => {
      const response = await api.put("/actual-vs-plan/plan", { planData }, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Export actual vs plan data
  static async exportActualVsPlan(format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
    return this.makeRequest(async () => {
      const response = await api.get(`/actual-vs-plan/export?format=${format}`, {
        headers: this.getAuthHeader(),
        responseType: 'blob',
        timeout: 30000,
      });

      return response.data;
    }, 1);
  }

  // Validate plan data before submission
  static validatePlanData(planData: PlanData[]): string[] {
    const errors: string[] = [];

    if (!Array.isArray(planData) || planData.length === 0) {
      errors.push("Plan data must be a non-empty array");
      return errors;
    }

    planData.forEach((plan, index) => {
      if (!plan.department?.trim()) {
        errors.push(`Plan item ${index + 1}: Department is required`);
      }
      if (!plan.position?.trim()) {
        errors.push(`Plan item ${index + 1}: Position is required`);
      }
      if (!plan.plannedCount || plan.plannedCount < 0) {
        errors.push(`Plan item ${index + 1}: Planned count must be a positive number`);
      }
      if (!plan.targetDate) {
        errors.push(`Plan item ${index + 1}: Target date is required`);
      } else {
        const date = new Date(plan.targetDate);
        if (isNaN(date.getTime())) {
          errors.push(`Plan item ${index + 1}: Invalid target date format`);
        }
      }
    });

    return errors;
  }

  // Calculate variance metrics
  static calculateVariance(planned: number, actual: number) {
    const variance = actual - planned;
    const variancePercentage = planned > 0 ? Math.round((variance / planned) * 100) : 0;
    const status: 'above' | 'below' | 'on-target' = 
      variance > 0 ? 'above' : variance < 0 ? 'below' : 'on-target';

    return { variance, variancePercentage, status };
  }

  // Get status color for UI
  static getStatusColor(status: 'above' | 'below' | 'on-target'): string {
    switch (status) {
      case 'above': return 'text-blue-600';
      case 'below': return 'text-red-600';
      case 'on-target': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  // Format variance display
  static formatVariance(variance: number, percentage: number): string {
    const sign = variance >= 0 ? '+' : '';
    return `${sign}${variance} (${sign}${percentage}%)`;
  }
}