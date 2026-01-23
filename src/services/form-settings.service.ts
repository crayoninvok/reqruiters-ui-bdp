import api from "./api";
import { Position } from "@/types/types";

export interface Requirements {
  maxAge?: number | null;
  gender?: "Laki-Laki" | "Perempuan" | null;
  minWeight?: number | null;
  maxWeight?: number | null;
  minHeight?: number | null;
  maxHeight?: number | null;
  workExperience?: "Fresh Graduated" | "Experienced" | null;
}

export interface FormSettings {
  isFormOpen: boolean;
  dueDate?: string | null;
  reason?: string | null;
  openPositions?: Position[];
  positionCounts?: Record<string, number> | null;
  requirements?: Requirements | null;
  updatedAt: string;
  updatedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface FormSettingsResponse {
  message: string;
  formSettings: FormSettings;
}

export interface ToggleFormStatusData {
  isFormOpen: boolean;
  dueDate?: string | null;
  reason?: string | null;
  openPositions?: Position[];
  positionCounts?: Record<string, number> | null;
  requirements?: Requirements | null;
}

export class FormSettingsService {
  // Helper to get the correct endpoint
  private static getEndpoint(path: string): string {
    const baseURL = api.defaults.baseURL || "";
    // Normalize path to start with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    
    // If baseURL already ends with /api, don't add it again
    if (baseURL.endsWith("/api") || baseURL.endsWith("/api/")) {
      return normalizedPath;
    }
    
    // Otherwise, add /api prefix if path doesn't already have it
    if (normalizedPath.startsWith("/api/")) {
      return normalizedPath;
    }
    
    return `/api${normalizedPath}`;
  }

  // Get form settings (public endpoint)
  static async getFormSettings(): Promise<FormSettingsResponse> {
    const response = await api.get<FormSettingsResponse>(
      this.getEndpoint("/form-settings")
    );
    return response.data;
  }

  // Toggle form status (HR/ADMIN/MANAGEMENT only)
  static async toggleFormStatus(
    data: ToggleFormStatusData
  ): Promise<FormSettingsResponse> {
    const response = await api.patch<FormSettingsResponse>(
      this.getEndpoint("/form-settings/toggle"),
      data
    );
    return response.data;
  }
}

