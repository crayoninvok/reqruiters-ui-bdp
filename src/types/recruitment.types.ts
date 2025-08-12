import { RecruitmentForm } from "@/types/types";
import { RecruitmentFormFilters } from "@/services/recruitment.service";

// Response interface from service
export interface RecruitmentFormsResponse {
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

// Extended filters interface
export interface ExtendedRecruitmentFormFilters extends RecruitmentFormFilters {
  // Add any additional filters specific to your component
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}