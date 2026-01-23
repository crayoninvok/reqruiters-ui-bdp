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
  // Get form settings (public endpoint)
  static async getFormSettings(): Promise<FormSettingsResponse> {
    const response = await api.get<FormSettingsResponse>(
      "/form-settings"
    );
    return response.data;
  }

  // Toggle form status (HR/ADMIN/MANAGEMENT only)
  static async toggleFormStatus(
    data: ToggleFormStatusData
  ): Promise<FormSettingsResponse> {
    const response = await api.patch<FormSettingsResponse>(
      "/form-settings/toggle",
      data
    );
    return response.data;
  }
}

