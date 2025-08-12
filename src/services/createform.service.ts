import api from "./api";
import { RecruitmentForm, ApiResponse, PaginatedResponse } from "@/types/types";

// Response interfaces
interface CreateRecruitmentFormResponse {
  message: string;
  recruitmentForm: RecruitmentForm;
}

interface GetRecruitmentFormsResponse {
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

interface RecruitmentStatsResponse {
  message: string;
  stats: {
    totalForms: number;
    recentForms: number;
    statusBreakdown: Array<{
      status: string;
      count: number;
    }>;
    topProvinces: Array<{
      province: string;
      count: number;
    }>;
    educationBreakdown: Array<{
      education: string;
      count: number;
    }>;
  };
}

// Query parameters interface
interface GetRecruitmentFormsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  province?: string;
  education?: string;
}

export class RecruitmentFormService {
  // Create a new recruitment form with file uploads
  static async createRecruitmentForm(
    formData: FormData
  ): Promise<CreateRecruitmentFormResponse> {
    try {
      const response = await api.post("/recruitment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating recruitment form:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create recruitment form"
      );
    }
  }

  // Get all recruitment forms with pagination and filtering
  static async getRecruitmentForms(
    params?: GetRecruitmentFormsParams
  ): Promise<GetRecruitmentFormsResponse> {
    try {
      const response = await api.get("/recruitment", { params });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching recruitment forms:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch recruitment forms"
      );
    }
  }

  // Get single recruitment form by ID
  static async getRecruitmentFormById(
    id: string
  ): Promise<{ message: string; recruitmentForm: RecruitmentForm }> {
    try {
      const response = await api.get(`/recruitment/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching recruitment form:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch recruitment form"
      );
    }
  }

  // Update recruitment form with file uploads
  static async updateRecruitmentForm(
    id: string,
    formData: FormData
  ): Promise<{ message: string; recruitmentForm: RecruitmentForm }> {
    try {
      const response = await api.put(`/recruitment/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating recruitment form:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update recruitment form"
      );
    }
  }

  // Update recruitment status only
  static async updateRecruitmentStatus(
    id: string,
    status: string
  ): Promise<{
    message: string;
    recruitmentForm: Pick<RecruitmentForm, "id" | "fullName" | "status" | "updatedAt">;
  }> {
    try {
      const response = await api.patch(`/recruitment/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error("Error updating recruitment status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update recruitment status"
      );
    }
  }

  // Delete recruitment form
  static async deleteRecruitmentForm(
    id: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/recruitment/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting recruitment form:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete recruitment form"
      );
    }
  }

  // Get recruitment statistics
  static async getRecruitmentStats(): Promise<RecruitmentStatsResponse> {
    try {
      const response = await api.get("/recruitment/stats");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching recruitment stats:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch recruitment statistics"
      );
    }
  }
}