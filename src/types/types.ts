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

// Recruitment Form Types
export interface RecruitmentForm {
  id: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
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

// Enums (matching your Prisma schema)
export enum Role {
  ADMIN = "ADMIN",
  HR = "HR",
}

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
  DEPT_HEAD_PRODUCTION_DEPARTMENT = "DEPT_HEADPRODUCTION_DEPARTMENT",
  HRGA_SPV = "HRGA_SPV",
  MECHANIC_INSTRUCTOR = "MECHANIC_INSTRUCTOR",
  DEPT_HEAD_LOGISTIC_DEPARTMENT = "DEPT_HEAD_LOGISTIC_DEPARTMENT",
  OPERATOR_WATER_TRUCK = "OPERATOR_WATER_TRUCK",
  OPERATOR_CRANE_TRUCK = "OPERATOR_CRANE_TRUC",
  HRGA_ADMIN = "HRGA_ADMIN",
  CAMP_SERVICE_TECHNICIAN = "CAMP_SERVICE_TECHNICIAN",
  CAMP_SERVICE_HELPER = "CAMP_SERVICE_HELPER",
  DEPT_HEAD_HRGA = "DEPT_HEAD_HRGA",
  TRAINER_MECHANIC = "TRAINER_MECHANIC",
  TRAINER_DOUBLE_TRAILER = "TRAINER_DOUBLE_TRAILER",
  GA_INFRASTRUCTURE = "GA_INFRASTRUCTURE",

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

export enum Certificate {
  AHLI_K3 = "AHLI_K3",
  SIM_A = "SIM A",
  SIM_B_I = "SIM_B_I",
  SIM_B_II = "SIM_B_II",
  SIM_C = "SIM C",
  SIM_D = "SIM D",
  PENGAWAS_OPERASIONAL_PERTAMA = "PENGAWAS_OPERASIONAL_PERTAMA",
  PENGAWAS_OPERASIONAL_MADYA = "PENGAWAS_OPERASIONAL_MADYA",
  PENGAWAS_OPERASIONAL_UTAMA = "PENGAWAS_OPERASIONAL_UTAMA",
  BASIC_MECHANIC_COURSE = "BASIC_MECHANIC_COURSE",
  TRAINING_OF_TRAINER = "TRAINING_OF_TRAINER",
  OPERATOR_CRANE = "OPERATOR_CRANE",
  SURAT_IZIN_OPERATOR_FORKLIFT = "SURAT_IZIN_OPERATOR_FORKLIFT",
  SERTIFIKAT_VAKSIN = "SERTIFIKAT_VAKSIN",
  SERTIFIKAT_LAINNYA = "SERTIFIKAT_LAINNYA",
  SERTIFIKAT_KONSTRUKSI = "SERTIFIKAT_KONSTRUKSI",
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
  D4 = "D4",
  D3 = "D3",
  S1 = "S1",
  S2 = "S2",
  S3 = "S3",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}

export enum RecruitmentStatus {
  PENDING = "PENDING",
  ON_PROGRESS = "ON_PROGRESS",
  INTERVIEW = "INTERVIEW",
  PSIKOTEST = "PSIKOTEST",
  USER_INTERVIEW = "USER_INTERVIEW",
  MEDICAL_CHECKUP = "MEDICAL_CHECKUP",
  MEDICAL_FOLLOWUP = "MEDICAL_FOLLOWUP",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
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
