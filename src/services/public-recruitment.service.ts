import api from "./api";

// Public recruitment form interfaces (keep existing)
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

// ADD NEW INTERFACE for file URLs
export interface RecruitmentFormWithUrls extends PublicRecruitmentFormData {
  documentPhotoUrl?: string;
  documentCvUrl?: string;
  documentKtpUrl?: string;
  documentSkckUrl?: string;
  documentVaccineUrl?: string;
  supportingDocsUrl?: string;
}

// ADD NEW INTERFACE for upload signature
interface UploadSignatureResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  folder: string;
  public_id: string;
  cloud_name: string;
}

// Keep existing interfaces
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

  // Keep existing retry logic
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
        
        const jitter = Math.random() * 0.3;
        const waitTime = delay * Math.pow(2, attempt - 1) * (1 + jitter);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw lastError;
  }

  // NEW METHOD: Get upload signature for direct Cloudinary upload
  static async getUploadSignature(fieldName: string): Promise<UploadSignatureResponse> {
    return this.makeRequest(async () => {
      const response = await api.post("/public-recruitment/upload-signature", {
        fieldName
      }, {
        timeout: 10000,
      });

      return response.data;
    });
  }

  // NEW METHOD: Upload file directly to Cloudinary
  static async uploadFileToCloudinary(
    file: File, 
    fieldName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Step 1: Get upload signature
      const signatureData = await this.getUploadSignature(fieldName);

      // Step 2: Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signatureData.signature);
      formData.append('timestamp', signatureData.timestamp.toString());
      formData.append('api_key', signatureData.api_key);
      formData.append('folder', signatureData.folder);
      formData.append('public_id', signatureData.public_id);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to Cloudinary');
      }

      const result = await uploadResponse.json();
      return result.secure_url;

    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
      throw error;
    }
  }

  // NEW METHOD: Submit form with direct Cloudinary upload (RECOMMENDED)
  static async submitRecruitmentFormWithDirectUpload(
    formData: PublicRecruitmentFormData,
    files: {
      documentPhoto?: File;
      documentCv?: File;
      documentKtp?: File;
      documentSkck?: File;
      documentVaccine?: File;
      supportingDocs?: File;
    },
    onUploadProgress?: (fieldName: string, progress: number) => void
  ): Promise<PublicSubmissionResponse> {
    try {
      // Step 1: Upload all files to Cloudinary first
      const uploadPromises = Object.entries(files)
        .filter(([_, file]) => file !== null && file !== undefined)
        .map(async ([fieldName, file]) => {
          const url = await this.uploadFileToCloudinary(
            file!, 
            fieldName,
            (progress) => onUploadProgress?.(fieldName, progress)
          );
          return { fieldName: `${fieldName}Url`, url };
        });

      const uploadResults = await Promise.all(uploadPromises);

      // Step 2: Create object with uploaded URLs
      const documentUrls = uploadResults.reduce((acc, result) => {
        acc[result.fieldName] = result.url;
        return acc;
      }, {} as any);

      // Step 3: Submit form data with URLs
      return this.makeRequest(async () => {
        const response = await api.post("/public-recruitment/submit-with-urls", {
          ...formData,
          ...documentUrls
        }, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        });

        return response.data;
      }, 1);

    } catch (error) {
      console.error('Form submission with direct upload error:', error);
      throw error;
    }
  }

  // KEEP EXISTING METHOD for backward compatibility
  static async submitRecruitmentForm(
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<PublicSubmissionResponse> {
    return this.makeRequest(async () => {
      const response = await api.post("/public-recruitment/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
        onUploadProgress,
      });

      return response.data;
    }, 1);
  }

  // Keep all existing methods unchanged
  static async getFormOptions(): Promise<FormOptionsResponse> {
    return this.makeRequest(async () => {
      const response = await api.get("/public-recruitment/options", {
        timeout: 10000,
      });

      return response.data;
    });
  }

  static async checkApplicationStatus(applicationId: string): Promise<ApplicationStatusResponse> {
    if (!applicationId?.trim()) {
      throw new Error("Application ID is required");
    }

    return this.makeRequest(async () => {
      const response = await api.get(`/public-recruitment/status/${applicationId}`, {
        timeout: 10000,
      });

      return response.data;
    });
  }

  // Keep existing validation methods unchanged
  static validateFormData(data: PublicRecruitmentFormData): string[] {
    const errors: string[] = [];

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

    if (!data.heightCm) {
      errors.push("Height is required");
    } else if (data.heightCm < 100 || data.heightCm > 250) {
      errors.push("Height must be between 100-250 cm");
    }

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
    } else if (data.address.length < 5) {
      errors.push("Please provide a complete address");
    }

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

  // UPDATED: File validation with proper size limits per field
  static validateFileUploads(files: {
    documentPhoto?: File;
    documentCv?: File;
    documentKtp?: File;
    documentSkck?: File;
    documentVaccine?: File;
    supportingDocs?: File;
  }): string[] {
    const errors: string[] = [];
    
    // Define size limits per field (in MB)
    const sizeLimits = {
      documentPhoto: 3,
      documentCv: 2,
      documentKtp: 1,
      documentSkck: 2,
      documentVaccine: 2,
      supportingDocs: 3,
    };

    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedDocTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    // Photo validation
    if (files.documentPhoto) {
      if (!allowedImageTypes.includes(files.documentPhoto.type)) {
        errors.push("Photo must be in JPEG, JPG, or PNG format");
      }
      if (files.documentPhoto.size > sizeLimits.documentPhoto * 1024 * 1024) {
        errors.push(`Photo file size must be less than ${sizeLimits.documentPhoto}MB`);
      }
    }

    // Document validations with specific size limits
    const docFields = [
      { file: files.documentCv, name: "CV", field: "documentCv" },
      { file: files.documentKtp, name: "KTP", field: "documentKtp" },
      { file: files.documentSkck, name: "SKCK", field: "documentSkck" },
      { file: files.documentVaccine, name: "Vaccine Certificate", field: "documentVaccine" },
      { file: files.supportingDocs, name: "Supporting Documents", field: "supportingDocs" },
    ];

    docFields.forEach(({ file, name, field }) => {
      if (file) {
        if (!allowedDocTypes.includes(file.type)) {
          errors.push(`${name} must be in PDF, JPEG, JPG, or PNG format`);
        }
        const limit = sizeLimits[field as keyof typeof sizeLimits];
        if (file.size > limit * 1024 * 1024) {
          errors.push(`${name} file size must be less than ${limit}MB`);
        }
      }
    });

    return errors;
  }

  // Keep existing utility methods unchanged
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

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (files) {
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });
    }

    return formData;
  }

  static formatErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return "An unexpected error occurred. Please try again.";
  }

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
      HIRED: {
        color: "green",
        label: "Hired",
        description: "Your application process has been completed"
      }
    };

    return statusMap[status] || {
      color: "gray",
      label: "Unknown",
      description: "Status information not available"
    };
  }

  static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.startsWith('62')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+62' + cleaned.substring(1);
    }
    
    return phoneNumber;
  }

  static cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[\s-]/g, '');
  }
}