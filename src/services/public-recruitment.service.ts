import api from "./api";

// Public recruitment form interfaces
export interface PublicRecruitmentFormData {
  fullName: string;
  birthPlace: string;
  birthDate: string;
  province: string;
  heightCm: number;
  weightKg: number;
  shirtSize: string;
  safetyShoesSize: string;
  pantsSize: string;
  address: string;
  whatsappNumber: string;
  certificate?: string[];
  education: string;
  schoolName: string;
  workExperience?: string;
  maritalStatus: string;
  appliedPosition: string;
  experienceLevel: string;
}

// Response interfaces
interface PublicSubmissionResponse {
  message: string;
  success: boolean;
  applicationId: string;
  submittedAt: string;
}

interface FormOptionsResponse {
  message: string;
  options: {
    provinces: string[];
    shirtSizes: string[];
    safetyShoeSizes: string[];
    pantsSizes: string[];
    certificates: string[];
    educationLevels: string[];
    maritalStatuses: string[];
    positions: string[];
    experienceLevels: string[];
  };
}

interface ApplicationStatusResponse {
  message: string;
  application: {
    id: string;
    applicantName: string;
    position: string;
    status: string;
    submittedAt: string;
    lastUpdated: string;
  };
}

interface ApiErrorResponse {
  message: string;
  error: string;
  success?: boolean;
}

export class PublicRecruitmentService {
  private static getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  }

  // Generic retry logic with exponential backoff
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
        
        // Don't retry on client errors (4xx) except 408 (timeout), 429 (rate limit)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          if (error.response.status !== 408 && error.response.status !== 429) {
            throw error;
          }
        }
        
        if (attempt === retries) {
          throw lastError;
        }
        
        // Exponential backoff with jitter
        const jitter = Math.random() * 0.3; // Add 0-30% jitter
        const waitTime = delay * Math.pow(2, attempt - 1) * (1 + jitter);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw lastError;
  }

  // Submit recruitment form (public endpoint - no auth required)
  static async submitRecruitmentForm(
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<PublicSubmissionResponse> {
    return this.makeRequest(async () => {
      const response = await api.post("/public-recruitment/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minutes for file uploads
        onUploadProgress,
      });

      return response.data;
    }, 1); // Don't retry form submissions to prevent duplicates
  }

  // Get form field options (public endpoint)
  static async getFormOptions(): Promise<FormOptionsResponse> {
    return this.makeRequest(async () => {
      const response = await api.get("/public-recruitment/options", {
        timeout: 10000,
      });

      return response.data;
    });
  }

  // Check application status by ID (public endpoint)
  static async checkApplicationStatus(applicationId: string): Promise<ApplicationStatusResponse> {
    if (!applicationId?.trim()) {
      throw new Error("Application ID is required");
    }

    return this.makeRequest(async () => {
      const response = await api.get(`/public/recruitment/status/${applicationId}`, {
        timeout: 10000,
      });

      return response.data;
    });
  }

  // Validate form data before submission
  static validateFormData(data: PublicRecruitmentFormData): string[] {
    const errors: string[] = [];

    // Required field validation
    if (!data.fullName?.trim()) {
      errors.push("Full name is required");
    } else if (data.fullName.length < 2 || data.fullName.length > 100) {
      errors.push("Full name must be between 2-100 characters");
    }

    if (!data.birthPlace?.trim()) {
      errors.push("Birth place is required");
    }

    if (!data.birthDate) {
      errors.push("Birth date is required");
    } else {
      const birthDate = new Date(data.birthDate);
      const now = new Date();
      const age = now.getFullYear() - birthDate.getFullYear();
      
      if (age < 17 || age > 65) {
        errors.push("Age must be between 17-65 years");
      }
    }

    if (!data.province) {
      errors.push("Province is required");
    }

    // Height validation
    if (!data.heightCm) {
      errors.push("Height is required");
    } else if (data.heightCm < 100 || data.heightCm > 250) {
      errors.push("Height must be between 100-250 cm");
    }

    // Weight validation  
    if (!data.weightKg) {
      errors.push("Weight is required");
    } else if (data.weightKg < 30 || data.weightKg > 200) {
      errors.push("Weight must be between 30-200 kg");
    }

    if (!data.shirtSize) {
      errors.push("Shirt size is required");
    }

    if (!data.safetyShoesSize) {
      errors.push("Safety shoes size is required");
    }

    if (!data.pantsSize) {
      errors.push("Pants size is required");
    }

    if (!data.address?.trim()) {
      errors.push("Address is required");
    } else if (data.address.length < 10) {
      errors.push("Please provide a complete address");
    }

    // WhatsApp number validation (Indonesian format)
    if (!data.whatsappNumber?.trim()) {
      errors.push("WhatsApp number is required");
    } else {
      const cleanNumber = data.whatsappNumber.replace(/[\s-]/g, '');
      const whatsappRegex = /^(\+62|62|0)[0-9]{8,13}$/;
      
      if (!whatsappRegex.test(cleanNumber)) {
        errors.push("Invalid WhatsApp number format (use Indonesian format: +62xxx, 62xxx, or 08xxx)");
      }
    }

    if (!data.education) {
      errors.push("Education level is required");
    }

    if (!data.schoolName?.trim()) {
      errors.push("School/University name is required");
    }

    if (!data.maritalStatus) {
      errors.push("Marital status is required");
    }

    if (!data.appliedPosition) {
      errors.push("Applied position is required");
    }

    if (!data.experienceLevel) {
      errors.push("Experience level is required");
    }

    return errors;
  }

  // Validate file uploads
  static validateFileUploads(files: {
    documentPhoto?: File;
    documentCv?: File;
    documentKtp?: File;
    documentSkck?: File;
    documentVaccine?: File;
    supportingDocs?: File;
  }): string[] {
    const errors: string[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedDocTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    // Photo validation (if provided)
    if (files.documentPhoto) {
      if (!allowedImageTypes.includes(files.documentPhoto.type)) {
        errors.push("Photo must be in JPEG, JPG, or PNG format");
      }
      if (files.documentPhoto.size > maxFileSize) {
        errors.push("Photo file size must be less than 5MB");
      }
    }

    // Document validations
    const docFields = [
      { file: files.documentCv, name: "CV" },
      { file: files.documentKtp, name: "KTP" },
      { file: files.documentSkck, name: "SKCK" },
      { file: files.documentVaccine, name: "Vaccine Certificate" },
      { file: files.supportingDocs, name: "Supporting Documents" },
    ];

    docFields.forEach(({ file, name }) => {
      if (file) {
        if (!allowedDocTypes.includes(file.type)) {
          errors.push(`${name} must be in PDF, JPEG, JPG, or PNG format`);
        }
        if (file.size > maxFileSize) {
          errors.push(`${name} file size must be less than 5MB`);
        }
      }
    });

    return errors;
  }

  // Create FormData object from form data and files
  static createFormData(
    data: PublicRecruitmentFormData,
    files?: {
      documentPhoto?: File;
      documentCv?: File;
      documentKtp?: File;
      documentSkck?: File;
      documentVaccine?: File;
      supportingDocs?: File;
    }
  ): FormData {
    const formData = new FormData();

    // Append text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // Handle certificate array
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append files if provided
    if (files) {
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });
    }

    return formData;
  }

  // Format error messages from API responses
  static formatErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return "An unexpected error occurred. Please try again.";
  }

  // Get status color/badge info for UI
  static getStatusInfo(status: string): {
    color: string;
    label: string;
    description: string;
  } {
    const statusMap: Record<string, { color: string; label: string; description: string }> = {
      PENDING: {
        color: "yellow",
        label: "Pending Review",
        description: "Your application is being reviewed by our HR team"
      },
      ON_PROGRESS: {
        color: "blue", 
        label: "In Progress",
        description: "Your application is currently being processed"
      },
      COMPLETED: {
        color: "green",
        label: "Completed",
        description: "Your application process has been completed"
      }
    };

    return statusMap[status] || {
      color: "gray",
      label: "Unknown",
      description: "Status information not available"
    };
  }

  // Helper to format phone number for display
  static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.startsWith('62')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+62' + cleaned.substring(1);
    }
    
    return phoneNumber;
  }

  // Helper to clean phone number for submission
  static cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[\s-]/g, '');
  }
}