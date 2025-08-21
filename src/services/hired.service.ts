import api from "./api";
import {
  HiredEmployee,
  ApiResponse,
  Department,
  Position,
  EmploymentStatus,
  ContractType,
  ShiftPattern,
  HiredEmployeeFilters,
  HiredEmployeeDetailResponse,
  HiredEmployeesResponse,
  HiredEmployeeStatsResponse,
  SupervisorsResponse,
  UpdateEmployeeData,
  TerminateEmployeeData,
  TransformedHiredEmployee,
  SupervisorOption

} from "@/types/types";


export class HiredEmployeeService {
  private static getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  private static getAuthHeader() {
    const token = this.getCookie("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private static getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
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
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError;
  }

  // Get all hired employees with comprehensive filtering
  static async getHiredEmployees(
    filters: HiredEmployeeFilters = {}
  ): Promise<HiredEmployeesResponse> {
    return this.makeRequest(async () => {
      const params = new URLSearchParams();

      // Pagination
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      // Search and basic filters
      if (filters.search) params.append("search", filters.search);
      if (filters.department) params.append("department", filters.department);
      if (filters.position) params.append("position", filters.position);
      if (filters.employmentStatus) params.append("employmentStatus", filters.employmentStatus);
      if (filters.contractType) params.append("contractType", filters.contractType);
      if (filters.shiftPattern) params.append("shiftPattern", filters.shiftPattern);
      if (filters.supervisorId) params.append("supervisorId", filters.supervisorId);
      if (filters.workLocation) params.append("workLocation", filters.workLocation);
      
      // Boolean filter
      if (filters.isActive !== undefined) {
        params.append("isActive", filters.isActive.toString());
      }

      // Date range filters
      if (filters.startDateFrom) params.append("startDateFrom", filters.startDateFrom);
      if (filters.startDateTo) params.append("startDateTo", filters.startDateTo);
      if (filters.probationEndDateFrom) params.append("probationEndDateFrom", filters.probationEndDateFrom);
      if (filters.probationEndDateTo) params.append("probationEndDateTo", filters.probationEndDateTo);
      if (filters.hiredDateFrom) params.append("hiredDateFrom", filters.hiredDateFrom);
      if (filters.hiredDateTo) params.append("hiredDateTo", filters.hiredDateTo);
      if (filters.terminationDateFrom) params.append("terminationDateFrom", filters.terminationDateFrom);
      if (filters.terminationDateTo) params.append("terminationDateTo", filters.terminationDateTo);

      // Salary range filters
      if (filters.salaryMin) params.append("salaryMin", filters.salaryMin.toString());
      if (filters.salaryMax) params.append("salaryMax", filters.salaryMax.toString());

      const response = await api.get(`/hired?${params.toString()}`, {
        headers: this.getAuthHeader(),
        timeout: 30000,
      });

      return response.data;
    });
  }

  // Get single hired employee by ID with full details
  static async getHiredEmployeeById(id: string): Promise<HiredEmployeeDetailResponse> {
    return this.makeRequest(async () => {
      const response = await api.get(`/hired/${id}`, {
        headers: this.getAuthHeader(),
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Get hired employees statistics and analytics
  static async getHiredEmployeesStats(): Promise<HiredEmployeeStatsResponse> {
    return this.makeRequest(async () => {
      const response = await api.get("/hired/stats", {
        headers: this.getAuthHeader(),
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Get available supervisors for dropdown/selection
  static async getAvailableSupervisors(department?: Department): Promise<SupervisorsResponse> {
    return this.makeRequest(async () => {
      const params = new URLSearchParams();
      if (department) params.append("department", department);

      const response = await api.get(`/hired/supervisors?${params.toString()}`, {
        headers: this.getAuthHeader(),
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Update hired employee information
  static async updateHiredEmployee(
    id: string,
    updateData: UpdateEmployeeData
  ): Promise<HiredEmployeeDetailResponse> {
    return this.makeRequest(async () => {
      const response = await api.put(`/hired/${id}`, updateData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Update employment status only
  static async updateEmploymentStatus(
    id: string,
    status: EmploymentStatus
  ): Promise<HiredEmployeeDetailResponse> {
    return this.makeRequest(async () => {
      const response = await api.patch(
        `/hired/${id}/status`,
        { employmentStatus: status },
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return response.data;
    });
  }

  // Terminate employee
  static async terminateEmployee(
    id: string,
    terminationData: TerminateEmployeeData
  ): Promise<HiredEmployeeDetailResponse> {
    return this.makeRequest(async () => {
      const response = await api.patch(
        `/hired/${id}/terminate`,
        terminationData,
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      return response.data;
    }, 1); // Don't retry termination to avoid confusion
  }

  // Reactivate terminated employee
  static async reactivateEmployee(id: string): Promise<HiredEmployeeDetailResponse> {
    return this.makeRequest(async () => {
      const response = await api.patch(
        `/hired/${id}/reactivate`,
        {},
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      return response.data;
    });
  }

  // Bulk update employment status
  static async bulkUpdateEmploymentStatus(
    ids: string[],
    status: EmploymentStatus
  ): Promise<ApiResponse> {
    return this.makeRequest(async () => {
      const response = await api.patch(
        "/hired/bulk-status",
        { ids, employmentStatus: status },
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      return response.data;
    });
  }

  // Export hired employees data
  static async exportHiredEmployees(
    filters: HiredEmployeeFilters = {},
    format: "csv" | "excel" = "excel"
  ): Promise<Blob> {
    return this.makeRequest(async () => {
      const params = new URLSearchParams();

      // Add filters to export
      if (filters.search) params.append("search", filters.search);
      if (filters.department) params.append("department", filters.department);
      if (filters.employmentStatus) params.append("employmentStatus", filters.employmentStatus);
      if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());
      
      params.append("format", format);

      const response = await api.get(`/hired/export?${params.toString()}`, {
        headers: this.getAuthHeader(),
        responseType: "blob",
        timeout: 60000,
      });

      return response.data;
    }, 1); // Don't retry exports
  }

  // Get employee hierarchy (subordinates)
  static async getEmployeeSubordinates(id: string): Promise<{
    message: string;
    subordinates: TransformedHiredEmployee[];
  }> {
    return this.makeRequest(async () => {
      const response = await api.get(`/hired/${id}/subordinates`, {
        headers: this.getAuthHeader(),
        timeout: 15000,
      });

      return response.data;
    });
  }

  // Validation Methods
  
  // Validate employee update data
  static validateUpdateData(data: UpdateEmployeeData): string[] {
    const errors: string[] = [];

    // Validate salary
    if (data.basicSalary !== undefined) {
      if (data.basicSalary < 0 || data.basicSalary > 1000000000) {
        errors.push("Basic salary must be between 0 and 1,000,000,000");
      }
    }

    // Validate probation end date
    if (data.probationEndDate) {
      const probationEndDate = new Date(data.probationEndDate);
      const today = new Date();
      
      if (isNaN(probationEndDate.getTime())) {
        errors.push("Invalid probation end date format");
      }
    }

    // Validate phone number format
    if (data.emergencyContactPhone) {
      if (!/^(\+62|62|0)[0-9]{9,13}$/.test(data.emergencyContactPhone)) {
        errors.push("Invalid emergency contact phone number format");
      }
    }

    return errors;
  }

  // Validate termination data
  static validateTerminationData(data: TerminateEmployeeData): string[] {
    const errors: string[] = [];

    if (!data.terminationDate) {
      errors.push("Termination date is required");
    } else {
      const terminationDate = new Date(data.terminationDate);
      const today = new Date();
      
      if (isNaN(terminationDate.getTime())) {
        errors.push("Invalid termination date format");
      } else if (terminationDate > today) {
        errors.push("Termination date cannot be in the future");
      }
    }

    if (!data.terminationReason?.trim()) {
      errors.push("Termination reason is required");
    }

    return errors;
  }

  // Utility Methods

  // Format employee data for display
  static formatEmployeeData(employee: TransformedHiredEmployee | HiredEmployee) {
    return {
      ...employee,
      formattedStartDate: new Date(employee.startDate).toLocaleDateString('id-ID'),
      formattedProbationEndDate: employee.probationEndDate 
        ? new Date(employee.probationEndDate).toLocaleDateString('id-ID')
        : null,
      formattedTerminationDate: employee.terminationDate 
        ? new Date(employee.terminationDate).toLocaleDateString('id-ID')
        : null,
      formattedHiredDate: new Date(employee.hiredDate).toLocaleDateString('id-ID'),
      formattedSalary: employee.basicSalary 
        ? new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(employee.basicSalary)
        : null,
    };
  }

  // Get department display name
  static getDepartmentDisplayName(department: Department): string {
    const departmentNames: Record<Department, string> = {
      PRODUCTION_ENGINEERING: "Production Engineering",
      OPERATIONAL: "Operational", 
      PLANT: "Plant",
      LOGISTIC: "Logistic",
      HUMAN_RESOURCES_GA: "Human Resources & GA",
      HEALTH_SAFETY_ENVIRONMENT: "Health Safety & Environment",
      PURCHASING: "Purchasing",
      INFORMATION_TECHNOLOGY: "Information Technology",
      MEDICAL: "Medical",
      TRAINING_DEVELOPMENT: "Training & Development",
    };
    
    return departmentNames[department] || department;
  }

  // Get position display name
  static getPositionDisplayName(position: Position): string {
    return position
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Get employment status display name with color coding
  static getEmploymentStatusDisplay(status: EmploymentStatus) {
    const statusConfig: Record<EmploymentStatus, { label: string; color: string }> = {
      PROBATION: { label: "Probation", color: "orange" },
      PERMANENT: { label: "Permanent", color: "green" },
      CONTRACT: { label: "Contract", color: "blue" },
      TERMINATED: { label: "Terminated", color: "red" },
      RESIGNED: { label: "Resigned", color: "gray" },
    };
    
    return statusConfig[status] || { label: status, color: "gray" };
  }

  // Get shift pattern display name
  static getShiftPatternDisplay(pattern: ShiftPattern): string {
    const patterns: Record<ShiftPattern, string> = {
      DAY_SHIFT: "Day Shift",
      NIGHT_SHIFT: "Night Shift",
      ROTATING: "Rotating Shift",
      FLEXIBLE: "Flexible",
    };
    
    return patterns[pattern] || pattern;
  }

  // Calculate employment duration
  static calculateEmploymentDuration(startDate: string, endDate?: string): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    let duration = "";
    if (years > 0) duration += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) duration += `${months} month${months > 1 ? 's' : ''} `;
    if (days > 0 && years === 0) duration += `${days} day${days > 1 ? 's' : ''}`;
    
    return duration.trim() || "Less than a day";
  }

  // Check if employee is still in probation
  static isProbationPeriod(startDate: string, probationEndDate?: string): boolean {
    if (!probationEndDate) return false;
    
    const now = new Date();
    const probationEnd = new Date(probationEndDate);
    
    return now <= probationEnd;
  }

  // Get filtered options for dropdowns
  static getFilteredSupervisors(
    supervisors: SupervisorOption[],
    currentEmployeeDepartment?: Department,
    currentEmployeeId?: string
  ): SupervisorOption[] {
    return supervisors.filter(supervisor => {
      // Don't allow self-supervision
      if (supervisor.id === currentEmployeeId) return false;
      
      // Optionally filter by department
      if (currentEmployeeDepartment && supervisor.department !== currentEmployeeDepartment) {
        return false;
      }
      
      return true;
    });
  }

  // Generate employee summary for reports
  static generateEmployeeSummary(employee: TransformedHiredEmployee | HiredEmployee): string {
    const formatted = this.formatEmployeeData(employee);
    const duration = this.calculateEmploymentDuration(employee.startDate, employee.terminationDate);
    
    return `${employee.employeeId} - ${'fullName' in employee ? employee.fullName : (employee as any).recruitmentForm?.fullName} | ${this.getDepartmentDisplayName(employee.department)} | ${duration} | ${this.getEmploymentStatusDisplay(employee.employmentStatus).label}`;
  }
  // Delete/Deactivate hired employee (soft delete)
static async deleteHiredEmployee(
  id: string,
  terminationData?: {
    terminationReason?: string;
    terminationDate?: string;
    hardDelete?: boolean;
  }
): Promise<HiredEmployeeDetailResponse> {
  return this.makeRequest(async () => {
    const response = await api.delete(`/hired/${id}`, {
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      data: terminationData || {},
      timeout: 15000,
    });

    return response.data;
  }, 1); // Don't retry delete operations
}

// Restore/Reactivate hired employee
static async restoreHiredEmployee(id: string): Promise<HiredEmployeeDetailResponse> {
  return this.makeRequest(async () => {
    const response = await api.patch(`/hired/${id}/restore`, {}, {
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    return response.data;
  });
}

// Bulk delete employees
static async bulkDeleteEmployees(
  ids: string[],
  terminationData: {
    terminationReason: string;
    terminationDate?: string;
    hardDelete?: boolean;
  }
): Promise<ApiResponse> {
  return this.makeRequest(async () => {
    const response = await api.delete("/hired/bulk-delete", {
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      data: { ids, ...terminationData },
      timeout: 30000,
    });

    return response.data;
  }, 1); // Don't retry bulk operations
}

// Check if employee can be deleted (no active subordinates)
static async checkEmployeeDeletability(id: string): Promise<{
  canDelete: boolean;
  reason?: string;
  subordinatesCount?: number;
}> {
  return this.makeRequest(async () => {
    const response = await api.get(`/hired/${id}/check-deletable`, {
      headers: this.getAuthHeader(),
      timeout: 10000,
    });

    return response.data;
  });
}

// Additional validation methods for the new functionality

// Validate deletion data
static validateDeletionData(data: {
  terminationReason?: string;
  terminationDate?: string;
  hardDelete?: boolean;
}): string[] {
  const errors: string[] = [];

  if (data.hardDelete) {
    // For hard delete, we might want to add extra warnings
    if (!data.terminationReason?.trim()) {
      errors.push("Termination reason is required for permanent deletion");
    }
  } else {
    // For soft delete
    if (!data.terminationReason?.trim()) {
      errors.push("Termination reason is required");
    }

    if (data.terminationDate) {
      const terminationDate = new Date(data.terminationDate);
      const today = new Date();
      
      if (isNaN(terminationDate.getTime())) {
        errors.push("Invalid termination date format");
      } else if (terminationDate > today) {
        errors.push("Termination date cannot be in the future");
      }
    }
  }

  return errors;
}

// Enhanced validation for update data with supervisor checks
static validateUpdateDataEnhanced(data: UpdateEmployeeData & { 
  currentEmployeeId?: string;
  availableSupervisors?: SupervisorOption[];
}): string[] {
  const errors = this.validateUpdateData(data);

  // Validate supervisor selection
  if (data.supervisorId) {
    if (data.supervisorId === data.currentEmployeeId) {
      errors.push("Employee cannot be their own supervisor");
    }

    if (data.availableSupervisors) {
      const supervisorExists = data.availableSupervisors.find(
        s => s.id === data.supervisorId
      );
      if (!supervisorExists) {
        errors.push("Selected supervisor is not available or invalid");
      }
    }
  }

  // Validate employment status transitions
  if (data.employmentStatus) {
    // Add business logic for valid status transitions if needed
    const validTransitions = {
      PROBATION: [EmploymentStatus.PERMANENT, EmploymentStatus.TERMINATED, EmploymentStatus.RESIGNED],
      PERMANENT: [EmploymentStatus.CONTRACT, EmploymentStatus.TERMINATED, EmploymentStatus.RESIGNED],
      CONTRACT: [EmploymentStatus.PERMANENT, EmploymentStatus.TERMINATED, EmploymentStatus.RESIGNED],
      TERMINATED: [EmploymentStatus.PERMANENT], // Only if restoring
      RESIGNED: [], // Usually can't change from resigned
    };
    
    // This would require knowing the current status, which you'd need to pass in
  }

  // Validate date relationships
  if (data.startDate && data.terminationDate) {
    const start = new Date(data.startDate);
    const termination = new Date(data.terminationDate);
    
    if (termination <= start) {
      errors.push("Termination date must be after start date");
    }
  }

  if (data.startDate && data.probationEndDate) {
    const start = new Date(data.startDate);
    const probationEnd = new Date(data.probationEndDate);
    
    if (probationEnd <= start) {
      errors.push("Probation end date must be after start date");
    }
  }

  return errors;
}

// Utility method to confirm dangerous operations
static createConfirmationMessage(
  action: 'delete' | 'restore' | 'terminate',
  employee: { employeeId: string; fullName?: string },
  isHardDelete = false
): {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isDangerous: boolean;
} {
  const employeeName = employee.fullName || employee.employeeId;

  switch (action) {
    case 'delete':
      return {
        title: isHardDelete ? 'Permanently Delete Employee' : 'Deactivate Employee',
        message: isHardDelete 
          ? `Are you sure you want to permanently delete ${employeeName}? This action cannot be undone and will remove all employee data from the system.`
          : `Are you sure you want to deactivate ${employeeName}? This will mark them as terminated but preserve their data for historical records.`,
        confirmText: isHardDelete ? 'Permanently Delete' : 'Deactivate',
        cancelText: 'Cancel',
        isDangerous: true,
      };
    
    case 'restore':
      return {
        title: 'Restore Employee',
        message: `Are you sure you want to restore ${employeeName}? This will reactivate their employee status.`,
        confirmText: 'Restore',
        cancelText: 'Cancel',
        isDangerous: false,
      };
    
    case 'terminate':
      return {
        title: 'Terminate Employee',
        message: `Are you sure you want to terminate ${employeeName}? Please provide a termination reason and date.`,
        confirmText: 'Terminate',
        cancelText: 'Cancel',
        isDangerous: true,
      };
    
    default:
      return {
        title: 'Confirm Action',
        message: 'Are you sure you want to perform this action?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isDangerous: false,
      };
  }
}

// Generate audit log entry for tracking changes
static generateAuditLogEntry(
  action: 'create' | 'update' | 'delete' | 'restore',
  employee: { employeeId: string; fullName?: string },
  changes?: Record<string, any>,
  reason?: string
): {
  action: string;
  employeeId: string;
  employeeName: string;
  changes?: Record<string, any>;
  reason?: string;
  timestamp: string;
} {
  return {
    action,
    employeeId: employee.employeeId,
    employeeName: employee.fullName || employee.employeeId,
    changes,
    reason,
    timestamp: new Date().toISOString(),
  };
}

// Helper method to check for unsaved changes
static hasUnsavedChanges(
  originalData: UpdateEmployeeData,
  currentData: UpdateEmployeeData,
  fieldsToCheck: (keyof UpdateEmployeeData)[]
): boolean {
  return fieldsToCheck.some(field => {
    const original = originalData[field];
    const current = currentData[field];
    
    // Handle date comparisons
    if (field.includes('Date') || field.includes('date')) {
      const originalDate = original ? new Date(original as string).getTime() : null;
      const currentDate = current ? new Date(current as string).getTime() : null;
      return originalDate !== currentDate;
    }
    
    // Handle numeric comparisons
    if (typeof original === 'number' || typeof current === 'number') {
      return Number(original) !== Number(current);
    }
    
    return original !== current;
  });
}

// Format changes for display in confirmation dialogs
static formatChangesForDisplay(
  originalData: Record<string, any>,
  updatedData: Record<string, any>,
  fieldLabels: Record<string, string>
): Array<{
  field: string;
  label: string;
  from: string;
  to: string;
}> {
  const changes: Array<{
    field: string;
    label: string;
    from: string;
    to: string;
  }> = [];

  Object.keys(updatedData).forEach(key => {
    if (originalData[key] !== updatedData[key] && updatedData[key] !== undefined) {
      const label = fieldLabels[key] || key;
      let fromValue = originalData[key]?.toString() || 'Not set';
      let toValue = updatedData[key]?.toString() || 'Not set';

      // Format specific field types
      if (key.includes('Date') || key.includes('date')) {
        fromValue = originalData[key] ? new Date(originalData[key]).toLocaleDateString('id-ID') : 'Not set';
        toValue = updatedData[key] ? new Date(updatedData[key]).toLocaleDateString('id-ID') : 'Not set';
      }

      if (key === 'basicSalary') {
        fromValue = originalData[key] 
          ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(originalData[key])
          : 'Not set';
        toValue = updatedData[key]
          ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(updatedData[key])
          : 'Not set';
      }

      if (key === 'department') {
        fromValue = originalData[key] ? this.getDepartmentDisplayName(originalData[key]) : 'Not set';
        toValue = updatedData[key] ? this.getDepartmentDisplayName(updatedData[key]) : 'Not set';
      }

      if (key === 'employmentStatus') {
        fromValue = originalData[key] ? this.getEmploymentStatusDisplay(originalData[key]).label : 'Not set';
        toValue = updatedData[key] ? this.getEmploymentStatusDisplay(updatedData[key]).label : 'Not set';
      }

      changes.push({
        field: key,
        label,
        from: fromValue,
        to: toValue,
      });
    }
  });

  return changes;
}
}
