import api from "./api";
import { RecruitmentForm, CreateRecruitmentFormData, ApiResponse } from "@/types/types";

export interface RecruitmentFormFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  province?: string;
  education?: string;
  appliedPosition?: string;
  startDate?: string;
  endDate?: string;
}

interface RecruitmentFormsResponse {
  message: string;
  recruitmentForms: RecruitmentForm[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface RecruitmentFormResponse {
  message: string;
  recruitmentForm: RecruitmentForm;
}

interface RecruitmentStats {
  totalForms: number;
  recentForms: number;
  statusBreakdown: { status: string; count: number }[];
  topProvinces: { province: string; count: number }[];
  educationBreakdown: { education: string; count: number }[];
}

interface RecruitmentStatsResponse {
  message: string;
  stats: RecruitmentStats;
}

export class RecruitmentFormService {
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

  private static getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  // Generic retry logic for failed requests
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
        
        // Don't retry on client errors (4xx) except 408, 429
        if (error.response?.status >= 400 && error.response?.status < 500) {
          if (error.response.status !== 408 && error.response.status !== 429) {
            throw error;
          }
        }
        
        if (attempt === retries) {
          throw lastError;
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  }

  // Get all recruitment forms with pagination and filtering
  static async getRecruitmentForms(
    filters: RecruitmentFormFilters = {}
  ): Promise<RecruitmentFormsResponse> {
    return this.makeRequest(async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.status) params.append("status", filters.status);
      if (filters.province) params.append("province", filters.province);
      if (filters.education) params.append("education", filters.education);
      if (filters.appliedPosition) params.append("appliedPosition", filters.appliedPosition);

      const response = await api.get(`/recruitment?${params.toString()}`, {
        headers: this.getAuthHeader(),
        timeout: 30000, // 30 seconds timeout
      });

      return response.data;
    });
  }

  // Get single recruitment form by ID
  static async getRecruitmentFormById(id: string): Promise<RecruitmentFormResponse> {
    return this.makeRequest(async () => {
      const response = await api.get(`/recruitment/${id}`, {
        headers: this.getAuthHeader(),
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Create new recruitment form with files
  static async createRecruitmentForm(
    formData: FormData
  ): Promise<RecruitmentFormResponse> {
    return this.makeRequest(async () => {
      const response = await api.post("/recruitment", formData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds for file uploads
      });

      return response.data;
    }, 1); // Don't retry file uploads to avoid duplicate creation
  }

  // Update recruitment form
  static async updateRecruitmentForm(
    id: string,
    formData: FormData
  ): Promise<RecruitmentFormResponse> {
    return this.makeRequest(async () => {
      const response = await api.put(`/recruitment/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      return response.data;
    }, 1); // Don't retry file updates
  }

  // Update only recruitment status
  static async updateRecruitmentStatus(
    id: string,
    status: string
  ): Promise<RecruitmentFormResponse> {
    return this.makeRequest(async () => {
      const response = await api.patch(`/recruitment/${id}/status`, { status }, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      return response.data;
    });
  }

  // Delete recruitment form
  static async deleteRecruitmentForm(id: string): Promise<ApiResponse> {
    return this.makeRequest(async () => {
      const response = await api.delete(`/recruitment/${id}`, {
        headers: this.getAuthHeader(),
        timeout: 30000, // Longer timeout for file cleanup
      });

      return response.data;
    }, 1); // Don't retry deletes to avoid confusion
  }

  // Get recruitment statistics
  static async getRecruitmentStats(): Promise<RecruitmentStatsResponse> {
    return this.makeRequest(async () => {
      const response = await api.get("/recruitment/stats", {
        headers: this.getAuthHeader(),
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Additional utility methods

  // Bulk status update
  static async bulkUpdateStatus(
    ids: string[], 
    status: string
  ): Promise<ApiResponse> {
    return this.makeRequest(async () => {
      const response = await api.patch("/recruitment/bulk-status", { ids, status }, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      return response.data;
    });
  }

  // Export recruitment forms (if supported by backend)
  static async exportRecruitmentForms(
    filters: RecruitmentFormFilters = {},
    format: 'csv' | 'excel' = 'excel'
  ): Promise<Blob> {
    return this.makeRequest(async () => {
      const params = new URLSearchParams();
      
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.province) params.append("province", filters.province);
      if (filters.education) params.append("education", filters.education);
      if (filters.appliedPosition) params.append("appliedPosition", filters.appliedPosition);
      
      params.append("format", format);

      const response = await api.get(`/recruitment/export?${params.toString()}`, {
        headers: this.getAuthHeader(),
        responseType: 'blob',
        timeout: 60000,
      });

      return response.data;
    }, 1); // Don't retry exports
  }

  // Validate form data before submission
  static validateFormData(data: CreateRecruitmentFormData): string[] {
    const errors: string[] = [];

    if (!data.fullName?.trim()) errors.push("Full name is required");
    if (!data.birthPlace?.trim()) errors.push("Birth place is required");
    if (!data.birthDate) errors.push("Birth date is required");
    if (!data.province) errors.push("Province is required");
    if (!data.heightCm || data.heightCm < 100 || data.heightCm > 250) {
      errors.push("Height must be between 100-250 cm");
    }
    if (!data.weightKg || data.weightKg < 30 || data.weightKg > 200) {
      errors.push("Weight must be between 30-200 kg");
    }
    if (!data.address?.trim()) errors.push("Address is required");
    if (!data.whatsappNumber?.trim()) errors.push("WhatsApp number is required");
    if (!data.education) errors.push("Education level is required");
    if (!data.schoolName?.trim()) errors.push("School name is required");
    if (!data.maritalStatus) errors.push("Marital status is required");

    // Validate WhatsApp number format (Indonesian)
    if (data.whatsappNumber && !/^(\+62|62|0)[0-9]{9,13}$/.test(data.whatsappNumber)) {
      errors.push("Invalid WhatsApp number format");
    }

    return errors;
  }
}