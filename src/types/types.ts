// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "HR";
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

// NEW: Hired Employee Types
export interface HiredEmployee {
  id: string;
  employeeId: string;
  recruitmentFormId: string;
  recruitmentForm?: {
    fullName: string;
    documentPhotoUrl?: string;
    gender: Gender;
    religion: Religion;
    appliedPosition?: Position;
    birthPlace: string;
    birthDate: string;
    province: Province;
    whatsappNumber: string;
    education: EducationLevel
    workExperience: string;
    maritalStatus: MaritalStatus;
    heightCm: number;
    weightKg: number;
    shirtSize: ShirtSize;
    safetyShoesSize: SafetyShoesSize;
    pantsSize: PantsSize;
    address: string;
  };
  hiredPosition: Position;
  department: Department;
  startDate: string;
  probationEndDate?: string;
  employmentStatus: EmploymentStatus;
  contractType: ContractType;
  basicSalary?: number;
  allowances?: any;
  supervisorId?: string;
  supervisor?: {
    employeeId: string;
    recruitmentForm: {
      fullName: string;
    };
  };
  subordinates?: HiredEmployee[];
  processedById: string;
  processedBy?: {
    name: string;
    email: string;
  };
  hiredDate: string;
  workLocation?: string;
  shiftPattern: ShiftPattern;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isActive: boolean;
  terminationDate?: string;
  terminationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// NEW: Migration Request Type
export interface MigrateToHiredRequest {
  recruitmentFormId: string;
  employeeId?: string;
  hiredPosition: Position;
  department: Department;
  startDate: string;
  probationEndDate?: string;
  contractType?: ContractType;
  basicSalary?: number;
  allowances?: any;
  supervisorId?: string;
  workLocation?: string;
  shiftPattern?: ShiftPattern;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

// Recruitment Form Types (Updated with hiredEmployee relation)
export interface RecruitmentForm {
  id: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  religion: Religion;
  gender: Gender;
  province: Province;
  heightCm: number;
  weightKg: number;
  shirtSize: ShirtSize;
  safetyShoesSize: SafetyShoesSize;
  pantsSize: PantsSize;
  address: string;
  whatsappNumber: string;
  certificate: Certificate[];
  education: EducationLevel;
  schoolName: string;
  jurusan?: string;
  workExperience?: string;
  maritalStatus: MaritalStatus;
  appliedPosition?: Position;
  status: RecruitmentStatus;
  documentPhotoUrl?: string;
  documentCvUrl?: string;
  documentKtpUrl?: string;
  documentSkckUrl?: string;
  documentVaccineUrl?: string;
  supportingDocsUrl?: string;
  experienceLevel?: ExperienceLevel;
  createdAt: string;
  updatedAt: string;
  // NEW: Relation to hired employee
  hiredEmployee?: {
    employeeId: string;
    department: Department;
    startDate: string;
    employmentStatus: EmploymentStatus;
  };
}

// NEW: Ready for Hiring Candidate Type
export interface ReadyForHiringCandidate {
  id: string;
  fullName: string;
  appliedPosition?: Position;
  whatsappNumber: string;
  education: EducationLevel;
  province: Province;
  updatedAt: string;
}

interface RecruitmentResponse {
  recruiters: RecruitmentForm[]; // or rename to 'applications'
}

// Recruiter Data Types
export interface RecruiterData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  employeeId?: string;
  notes?: string;
  createdById: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

// NEW: Statistics Types
export interface RecruitmentStats {
  totalForms: number;
  recentForms: number;
  statusBreakdown: {
    status: RecruitmentStatus;
    count: number;
  }[];
  topProvinces: {
    province: Province;
    count: number;
  }[];
  educationBreakdown: {
    education: EducationLevel;
    count: number;
  }[];
}

// Enums (matching your Prisma schema)
export enum Role {
  ADMIN = "ADMIN",
  HR = "HR",
}

// FIXED: Position enum values to match Prisma schema exactly
export enum Position {
  PROD_ENG_SPV = "PROD_ENG_SPV",
  PRODUCTION_GROUP_LEADER = "PRODUCTION_GROUP_LEADER",
  MOCO_LEADER = "MOCO_LEADER",
  CCR_ADMIN = "CCR_ADMIN",
  DRIVER_DOUBLE_TRAILER = "DRIVER_DOUBLE_TRAILER",
  WEIGHT_BRIDGE_ADMIN = "WEIGHT_BRIDGE_ADMIN",
  SIDE_DUMP_SPOTTER = "SIDE_DUMP_SPOTTER",
  PLAN_SPV = "PLAN_SPV",
  LOGISTIC_SPV = "LOGISTIC_SPV",
  PLANNER = "PLANNER",
  PLANT_GROUP_LEADER = "PLANT_GROUP_LEADER",
  TYRE_GROUP_LEADER = "TYRE_GROUP_LEADER",
  LOGISTIC_GROUP_LEADER = "LOGISTIC_GROUP_LEADER",
  MECHANIC_JR = "MECHANIC_JR",
  MECHANIC_SR = "MECHANIC_SR",
  WELDER = "WELDER",
  ELECTRICIAN = "ELECTRICIAN",
  TYREMAN = "TYREMAN",
  FABRICATION = "FABRICATION",
  OPERATOR_FUEL_TRUCK = "OPERATOR_FUEL_TRUCK",
  PLANT_ADMIN = "PLANT_ADMIN",
  TYRE_ADMIN = "TYRE_ADMIN",
  LOGISTIC_ADMIN = "LOGISTIC_ADMIN",
  HSE_SPV = "HSE_SPV",
  SAFETY_OFFICER = "SAFETY_OFFICER",
  ENVIRONMENT_OFFICER = "ENVIRONMENT_OFFICER",
  PARAMEDIC = "PARAMEDIC",
  HSE_ADMIN = "HSE_ADMIN",
  HRGA_GROUP_LEADER = "HRGA_GROUP_LEADER",
  GA_GROUP_LEADER = "GA_GROUP_LEADER",
  PDCA_OFFICER = "PDCA_OFFICER",
  PURCHASING_SPV = "PURCHASING_SPV",
  IT_SUPPORT = "IT_SUPPORT",
  DOCTOR = "DOCTOR",
  DEPT_HEAD_PRODUCTION_ENGINEERING = "DEPT_HEAD_PRODUCTION_ENGINEERING", // FIXED
  HRGA_SPV = "HRGA_SPV",
  MECHANIC_INSTRUCTOR = "MECHANIC_INSTRUCTOR",
  DEPT_HEAD_PLANT_LOGISTIC = "DEPT_HEAD_PLANT_LOGISTIC", // FIXED
  OPERATOR_WATER_TRUCK = "OPERATOR_WATER_TRUCK",
  OPERATOR_CRANE_TRUCK = "OPERATOR_CRANE_TRUCK", // FIXED
  HRGA_ADMIN = "HRGA_ADMIN",
  CAMP_SERVICE_TECHNICIAN = "CAMP_SERVICE_TECHNICIAN",
  CAMP_SERVICE_HELPER = "CAMP_SERVICE_HELPER",
  DEPT_HEAD_HRGA = "DEPT_HEAD_HRGA",
  TRAINER_MECHANIC = "TRAINER_MECHANIC",
  TRAINER_DOUBLE_TRAILER = "TRAINER_DOUBLE_TRAILER",
  GA_INFRASTRUCTURE = "GA_INFRASTRUCTURE",
  TOOLKEEPER = "TOOLKEEPER",
}

// NEW: Department enum (was missing entirely)
export enum Department {
  PRODUCTION_ENGINEERING = "PRODUCTION_ENGINEERING",
  OPERATIONAL = "OPERATIONAL",
  PLANT = "PLANT",
  LOGISTIC = "LOGISTIC",
  HUMAN_RESOURCES_GA = "HUMAN_RESOURCES_GA",
  HEALTH_SAFETY_ENVIRONMENT = "HEALTH_SAFETY_ENVIRONMENT",
  PURCHASING = "PURCHASING",
  INFORMATION_TECHNOLOGY = "INFORMATION_TECHNOLOGY",
  MEDICAL = "MEDICAL",
  TRAINING_DEVELOPMENT = "TRAINING_DEVELOPMENT",
}

// NEW: Employment Status enum (was missing)
export enum EmploymentStatus {
  PROBATION = "PROBATION",
  PERMANENT = "PERMANENT",
  CONTRACT = "CONTRACT",
  TERMINATED = "TERMINATED",
  RESIGNED = "RESIGNED",
}

// NEW: Contract Type enum (was missing)
export enum ContractType {
  PERMANENT = "PERMANENT",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
}

// NEW: Shift Pattern enum (was missing)
export enum ShiftPattern {
  DAY_SHIFT = "DAY_SHIFT",
  NIGHT_SHIFT = "NIGHT_SHIFT",
  ROTATING = "ROTATING",
  FLEXIBLE = "FLEXIBLE",
}

export enum Province {
  ACEH = "ACEH",
  SUMATERA_UTARA = "SUMATERA_UTARA",
  SUMATERA_BARAT = "SUMATERA_BARAT",
  RIAU = "RIAU",
  JAMBI = "JAMBI",
  SUMATERA_SELATAN = "SUMATERA_SELATAN",
  BENGKULU = "BENGKULU",
  LAMPUNG = "LAMPUNG",
  KEP_BANGKA_BELITUNG = "KEP_BANGKA_BELITUNG",
  KEP_RIAU = "KEP_RIAU",
  DKI_JAKARTA = "DKI_JAKARTA",
  JAWA_BARAT = "JAWA_BARAT",
  JAWA_TENGAH = "JAWA_TENGAH",
  DI_YOGYAKARTA = "DI_YOGYAKARTA",
  JAWA_TIMUR = "JAWA_TIMUR",
  BANTEN = "BANTEN",
  BALI = "BALI",
  NUSA_TENGGARA_BARAT = "NUSA_TENGGARA_BARAT",
  NUSA_TENGGARA_TIMUR = "NUSA_TENGGARA_TIMUR",
  KALIMANTAN_BARAT = "KALIMANTAN_BARAT",
  KALIMANTAN_TENGAH = "KALIMANTAN_TENGAH",
  KALIMANTAN_SELATAN = "KALIMANTAN_SELATAN",
  KALIMANTAN_TIMUR = "KALIMANTAN_TIMUR",
  KALIMANTAN_UTARA = "KALIMANTAN_UTARA",
  SULAWESI_UTARA = "SULAWESI_UTARA",
  SULAWESI_TENGAH = "SULAWESI_TENGAH",
  SULAWESI_SELATAN = "SULAWESI_SELATAN",
  SULAWESI_TENGGARA = "SULAWESI_TENGGARA",
  GORONTALO = "GORONTALO",
  SULAWESI_BARAT = "SULAWESI_BARAT",
  MALUKU = "MALUKU",
  MALUKU_UTARA = "MALUKU_UTARA",
  PAPUA = "PAPUA",
  PAPUA_BARAT = "PAPUA_BARAT",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum Religion {
  ISLAM = "ISLAM",
  PROTESTAN = "PROTESTAN",
  KATOLIK = "KATOLIK",
  HINDU = "HINDU",
  BUDDHA = "BUDDHA",
  KONGHUCU = "KONGHUCU",
}

export enum ShirtSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL",
}

export enum SafetyShoesSize {
  SIZE_38 = "SIZE_38",
  SIZE_39 = "SIZE_39",
  SIZE_40 = "SIZE_40",
  SIZE_41 = "SIZE_41",
  SIZE_42 = "SIZE_42",
  SIZE_43 = "SIZE_43",
  SIZE_44 = "SIZE_44",
}

export enum PantsSize {
  SIZE_28 = "SIZE_28",
  SIZE_29 = "SIZE_29",
  SIZE_30 = "SIZE_30",
  SIZE_31 = "SIZE_31",
  SIZE_32 = "SIZE_32",
  SIZE_33 = "SIZE_33",
  SIZE_34 = "SIZE_34",
  SIZE_35 = "SIZE_35",
  SIZE_36 = "SIZE_36",
}

// FIXED: Certificate enum values to match Prisma schema exactly
export enum Certificate {
  AHLI_K3 = "AHLI_K3",
  SIM_A = "SIM_A", // FIXED: was "SIM A"
  SIM_B_I = "SIM_B_I",
  SIM_B_II = "SIM_B_II",
  SIM_C = "SIM_C", // FIXED: was "SIM C"
  SIM_D = "SIM_D", // FIXED: was "SIM D"
  PENGAWAS_OPERASIONAL_PERTAMA = "PENGAWAS_OPERASIONAL_PERTAMA",
  PENGAWAS_OPERASIONAL_MADYA = "PENGAWAS_OPERASIONAL_MADYA",
  PENGAWAS_OPERASIONAL_UTAMA = "PENGAWAS_OPERASIONAL_UTAMA",
  BASIC_MECHANIC_COURSE = "BASIC_MECHANIC_COURSE",
  TRAINING_OF_TRAINER = "TRAINING_OF_TRAINER",
  OPERATOR_FORKLIFT = "OPERATOR_FORKLIFT", // NEW: was missing
  SURAT_IZIN_OPERATOR_FORKLIFT = "SURAT_IZIN_OPERATOR_FORKLIFT",
  OPERATOR_CRANE = "OPERATOR_CRANE",
  OPERATOR_FUEL_TRUCK = "OPERATOR_FUEL_TRUCK", // NEW: was missing
  SERTIFIKAT_VAKSIN = "SERTIFIKAT_VAKSIN",
  SERTIFIKAT_LAINNYA = "SERTIFIKAT_LAINNYA",
  SERTIFIKASI_KONSTRUKSI = "SERTIFIKASI_KONSTRUKSI", // FIXED: was SERTIFIKAT_KONSTRUKSI
  KIMPER = "KIMPER",
  SIMPER = "SIMPER",
  PLB3 = "PLB3",
  RIGGER = "RIGGER",
  SMKP = "SMKP",
  AHLI_K3_LISTRIK = "AHLI_K3_LISTRIK",
  SURAT_TANDA_REGISTRASI = "SURAT_TANDA_REGISTRASI",
  NONE = "NONE",
}

export enum EducationLevel {
  SD = "SD",
  SMP = "SMP",
  SMA = "SMA",
  SMK = "SMK",
  D3 = "D3",
  D4 = "D4",
  S1 = "S1",
  S2 = "S2",
  S3 = "S3",
}

export enum MaritalStatus {
  TK0 = "TK0",
  TK1 = "TK1",
  TK2 = "TK2",
  TK3 = "TK3",
  K0 = "K0",
  K1 = "K1",
  K2 = "K2",
  K3 = "K3",
  K_I_0 = "K_I_0",
  K_I_1 = "K_I_1",
  K_I_2 = "K_I_2",
  K_I_3 = "K_I_3",
}

// UPDATED: Added missing COMPLETED status
export enum RecruitmentStatus {
  PENDING = "PENDING",
  ON_PROGRESS = "ON_PROGRESS",
  INTERVIEW = "INTERVIEW",
  PSIKOTEST = "PSIKOTEST",
  USER_INTERVIEW = "USER_INTERVIEW",
  MEDICAL_CHECKUP = "MEDICAL_CHECKUP",
  MEDICAL_FOLLOWUP = "MEDICAL_FOLLOWUP",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED", // NEW: was missing
  HIRED = "HIRED",
}

export enum ExperienceLevel {
  FRESH_GRADUATED = "FRESH_GRADUATED",
  EXPERIENCED = "EXPERIENCED",
}

// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// NEW: Pagination Response (matches your controller)
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// NEW: API Response types matching your controller responses
export interface GetRecruitmentFormsResponse {
  message: string;
  recruitmentForms: RecruitmentForm[];
  pagination: PaginationInfo;
}

export interface GetCandidatesReadyForHiringResponse {
  message: string;
  candidates: ReadyForHiringCandidate[];
  count: number;
}

export interface MigrateToHiredResponse {
  message: string;
  hiredEmployee: HiredEmployee;
}

export interface GetRecruitmentStatsResponse {
  message: string;
  stats: RecruitmentStats;
}

// Form Types for Frontend
export interface CreateRecruitmentFormData {
  fullName: string;
  birthPlace: string;
  birthDate: Date;
  province: Province;
  heightCm: number;
  weightKg: number;
  shirtSize: ShirtSize;
  safetyShoesSize: SafetyShoesSize;
  pantsSize: PantsSize;
  address: string;
  whatsappNumber: string;
  certificate: Certificate[];
  education: EducationLevel;
  schoolName: string;
  jurusan?: string;
  workExperience?: string;
  maritalStatus: MaritalStatus;
  appliedPosition?: Position;
  experienceLevel?: ExperienceLevel;
}

export interface CreateRecruiterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  department?: string;
  position?: string;
  hireDate?: Date;
  employeeId?: string;
  notes?: string;
}

export interface HiredEmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
  department?: Department;
  position?: Position;
  employmentStatus?: EmploymentStatus;
  contractType?: ContractType;
  shiftPattern?: ShiftPattern;
  supervisorId?: string;
  isActive?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  probationEndDateFrom?: string;
  probationEndDateTo?: string;
  hiredDateFrom?: string;
  hiredDateTo?: string;
  salaryMin?: number;
  salaryMax?: number;
  workLocation?: string;
  terminationDateFrom?: string;
  terminationDateTo?: string;
}

export interface TransformedHiredEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  hiredPosition: Position;
  department: Department;
  startDate: string;
  probationEndDate?: string;
  employmentStatus: EmploymentStatus;
  contractType: ContractType;
  basicSalary?: number;
  allowances?: any;
  workLocation?: string;
  shiftPattern: ShiftPattern;
  isActive: boolean;
  terminationDate?: string;
  terminationReason?: string;
  hiredDate: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  whatsappNumber: string;
  province: string;
  education: string;
  appliedPosition?: Position;
  supervisor?: {
    employeeId: string;
    fullName: string;
  };
  subordinatesCount: number;
  processedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HiredEmployeesResponse {
  message: string;
  employees: TransformedHiredEmployee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  appliedFilters: Record<string, any>;
}

export interface HiredEmployeeDetailResponse {
  message: string;
  employee: HiredEmployee;
}

export interface HiredEmployeeStats {
  overview: {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    recentHires: number;
    probationaryEmployees: number;
  };
  departmentBreakdown: {
    department: Department;
    count: number;
  }[];
  employmentStatusBreakdown: {
    status: EmploymentStatus;
    count: number;
  }[];
  contractTypeBreakdown: {
    type: ContractType;
    count: number;
  }[];
  shiftPatternBreakdown: {
    pattern: ShiftPattern;
    count: number;
  }[];
  salaryInsights: {
    department: Department;
    averageSalary?: number;
    employeeCount: number;
  }[];
}

export interface HiredEmployeeStatsResponse {
  message: string;
  stats: HiredEmployeeStats;
}

export interface SupervisorOption {
  id: string;
  employeeId: string;
  fullName: string;
  position: Position;
  department: Department;
}

export interface SupervisorsResponse {
  message: string;
  supervisors: SupervisorOption[];
}

export interface UpdateEmployeeData {
  hiredPosition?: Position;
  department?: Department;
  employmentStatus?: EmploymentStatus;
  contractType?: ContractType;
  basicSalary?: number;
  allowances?: any;
  supervisorId?: string;
  workLocation?: string;
  shiftPattern?: ShiftPattern;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  probationEndDate?: string;
}

export interface TerminateEmployeeData {
  terminationDate: string;
  terminationReason: string;
}
// Add these interfaces to your types/types.ts file

// Enhanced update data interface
export interface UpdateEmployeeData {
  employeeId?: string;
  hiredPosition?: Position;
  department?: Department;
  startDate?: string;
  probationEndDate?: string;
  employmentStatus?: EmploymentStatus;
  contractType?: ContractType;
  basicSalary?: number;
  allowances?: any; // Match existing type declaration
  supervisorId?: string;
  workLocation?: string;
  shiftPattern?: ShiftPattern;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  terminationDate?: string;
  terminationReason?: string;
  isActive?: boolean;
  // Add any other fields that can be updated
}

// Deletion/Termination data
export interface DeletionData {
  terminationReason?: string;
  terminationDate?: string;
  hardDelete?: boolean;
}

// Bulk operation response
export interface BulkOperationResponse {
  message: string;
  processed: number;
  failed: number;
  errors?: Array<{
    employeeId: string;
    error: string;
  }>;
}

// Employee deletability check
export interface EmployeeDeletabilityCheck {
  canDelete: boolean;
  reason?: string;
  subordinatesCount?: number;
  activeSubordinates?: Array<{
    employeeId: string;
    fullName: string;
  }>;
}

// Confirmation dialog configuration
export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isDangerous: boolean;
}

// Audit log entry
export interface AuditLogEntry {
  action: "create" | "update" | "delete" | "restore";
  employeeId: string;
  employeeName: string;
  changes?: Record<string, any>;
  reason?: string;
  timestamp: string;
  performedBy?: string;
}

// Change tracking
export interface FieldChange {
  field: string;
  label: string;
  from: string;
  to: string;
}

// Enhanced validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Form state for employee editing
export interface EmployeeFormState {
  data: UpdateEmployeeData;
  originalData: UpdateEmployeeData;
  hasUnsavedChanges: boolean;
  isSubmitting: boolean;
  validationErrors: string[];
}

// Field labels for display
export const EMPLOYEE_FIELD_LABELS: Record<string, string> = {
  employeeId: "Employee ID",
  hiredPosition: "Position",
  department: "Department",
  startDate: "Start Date",
  probationEndDate: "Probation End Date",
  employmentStatus: "Employment Status",
  contractType: "Contract Type",
  basicSalary: "Basic Salary",
  supervisorId: "Supervisor",
  workLocation: "Work Location",
  shiftPattern: "Shift Pattern",
  emergencyContactName: "Emergency Contact Name",
  emergencyContactPhone: "Emergency Contact Phone",
  terminationDate: "Termination Date",
  terminationReason: "Termination Reason",
};
