"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  PublicRecruitmentService,
  PublicRecruitmentFormData,
} from "@/services/public-recruitment.service";
import {
  Upload,
  User,
  MapPin,
  Phone,
  GraduationCap,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
  Home,
  Info, // Add this
  ChevronDown, // Add this
  ChevronUp, // Add this
} from "lucide-react";
import Swal from "sweetalert2";
import SubmittedApp from "@/components/SubmittedApp";

const formatMaritalStatus = (value: string) => {
  // Handle K_I_ pattern for marital status
  if (value.startsWith("K_I_")) {
    const number = value.replace("K_I_", "");
    return `K/I/${number}`;
  }

  // Original logic for other values but always return uppercase
  const formatted = value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return formatted.toUpperCase();
};
const MaritalStatusField: React.FC<MaritalStatusFieldProps> = ({
  formData,
  handleInputChange,
  options,
  formatMaritalStatus,
}) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const maritalStatusInfo: Record<string, string> = {
    TK_0: "Tidak Kawin, Tidak ada tanggungan",
    TK_1: "Tidak Kawin, 1 tanggungan",
    TK_2: "Tidak Kawin, 2 tanggungan",
    TK_3: "Tidak Kawin, 3 tanggungan",
    K_0: "Kawin, Tidak ada tanggungan",
    K_1: "Kawin, 1 tanggungan",
    K_2: "Kawin, 2 tanggungan",
    K_3: "Kawin, 3 tanggungan",
    K_I_0: "Kawin dengan Istri, Tidak ada tanggungan",
    K_I_1: "Kawin dengan Istri, 1 tanggungan",
    K_I_2: "Kawin dengan Istri, 2 tanggungan",
    K_I_3: "Kawin dengan Istri, 3 tanggungan",
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2  items-center">
        Status Pernikahan *
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors rounded-full hover:bg-blue-50"
          title="Lihat penjelasan kode status pernikahan"
        >
          <Info className="h-4 w-4" />
        </button>
      </label>

      {showInfo && (
        <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-800 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Penjelasan Kode Status Pernikahan (PTKP):
            </h4>
            <button
              type="button"
              onClick={() => setShowInfo(false)}
              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-semibold text-blue-800 mb-2">
                Tidak Kawin (TK):
              </h5>
              <div className="space-y-1 text-blue-700">
                <div>
                  <span className="font-semibold">TK/0:</span> Tidak ada
                  tanggungan
                </div>
                <div>
                  <span className="font-semibold">TK/1:</span> 1 tanggungan
                </div>
                <div>
                  <span className="font-semibold">TK/2:</span> 2 tanggungan
                </div>
                <div>
                  <span className="font-semibold">TK/3:</span> 3 tanggungan
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-semibold text-blue-800 mb-2">Kawin (K):</h5>
              <div className="space-y-1 text-blue-700">
                <div>
                  <span className="font-semibold">K/0:</span> Tidak ada
                  tanggungan
                </div>
                <div>
                  <span className="font-semibold">K/1:</span> 1 tanggungan
                </div>
                <div>
                  <span className="font-semibold">K/2:</span> 2 tanggungan
                </div>
                <div>
                  <span className="font-semibold">K/3:</span> 3 tanggungan
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-blue-100 md:col-span-2">
              <h5 className="font-semibold text-blue-800 mb-2">
                Kawin dengan Istri (K/I):
              </h5>
              <div className="grid grid-cols-2 gap-4 text-blue-700">
                <div>
                  <span className="font-semibold">K/I/0:</span> Tidak ada
                  tanggungan
                </div>
                <div>
                  <span className="font-semibold">K/I/1:</span> 1 tanggungan
                </div>
                <div>
                  <span className="font-semibold">K/I/2:</span> 2 tanggungan
                </div>
                <div>
                  <span className="font-semibold">K/I/3:</span> 3 tanggungan
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-xs text-yellow-800">
                <strong>Catatan:</strong> Status ini digunakan untuk perhitungan
                pajak penghasilan (PPh 21). Tanggungan adalah anggota keluarga
                yang ditanggung secara finansial seperti anak atau keluarga lain
                yang sah.
              </p>
            </div>
          </div>
        </div>
      )}

      <select
        value={formData.maritalStatus}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleInputChange("maritalStatus", e.target.value)
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Pilih Status Pernikahan</option>
        {options.maritalStatuses.map((status: string) => {
          const displayText = formatMaritalStatus(status);
          const explanation = maritalStatusInfo[status];
          return (
            <option key={status} value={status}>
              {displayText} {explanation && `- ${explanation}`}
            </option>
          );
        })}
      </select>

      {formData.maritalStatus && maritalStatusInfo[formData.maritalStatus] && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-green-800">
                <strong>Status yang dipilih:</strong>{" "}
                {formatMaritalStatus(formData.maritalStatus)}
              </p>
              <p className="text-sm text-green-700 mt-1">
                {maritalStatusInfo[formData.maritalStatus]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface MaritalStatusFieldProps {
  formData: {
    maritalStatus: string;
  };
  handleInputChange: (field: keyof PublicRecruitmentFormData, value: any) => void;
  options: {
    maritalStatuses: string[];
  };
  formatMaritalStatus: (value: string) => string;
}
interface FormOptions {
  province: string[];
  gender: string[];
  religion: string[];
  shirtSizes: string[];
  safetyShoeSizes: string[];
  pantsSizes: string[];
  certificates: string[];
  educationLevels: string[];
  maritalStatuses: string[];
  positions: string[];
  experienceLevels: string[];
}

interface FormFiles {
  documentPhoto?: File;
  documentCv?: File;
  documentKtp?: File;
  documentSkck?: File;
  documentVaccine?: File;
  supportingDocs?: File;
}

interface UploadProgress {
  [key: string]: number;
}

const PublicRecruitmentPage: React.FC = () => {
  const [formData, setFormData] = useState<PublicRecruitmentFormData>({
    fullName: "",
    birthPlace: "",
    birthDate: "",
    province: "",
    gender: "",
    religion: "",
    heightCm: 0,
    weightKg: 0,
    shirtSize: "",
    safetyShoesSize: "",
    pantsSize: "",
    address: "",
    whatsappNumber: "",
    certificate: [],
    education: "",
    schoolName: "",
    jurusan: "",
    workExperience: "",
    maritalStatus: "",
    appliedPosition: "",
    experienceLevel: "",
  });

  const [files, setFiles] = useState<FormFiles>({});
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [currentUploadingFile, setCurrentUploadingFile] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);

  // React Quill configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
  ];

  // Load form options on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await PublicRecruitmentService.getFormOptions();
        setOptions(response.options);
      } catch (error) {
        console.error("Failed to load form options:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Gagal memuat data formulir. Silakan refresh halaman.",
          confirmButtonColor: "#2563eb",
        });
      }
    };

    loadOptions();
  }, []);

  const handleInputChange = (
    field: keyof PublicRecruitmentFormData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Special handler for React Quill content
  const handleQuillChange = (
    field: keyof PublicRecruitmentFormData,
    content: string
  ) => {
    // Remove HTML tags for plain text storage, or keep HTML if you want rich formatting
    const plainText = content.replace(/<[^>]*>/g, "").trim();

    // You can choose to store HTML content or plain text
    // For plain text: use plainText
    // For HTML content: use content
    handleInputChange(field, content);
  };

  const handleFileChange = (field: keyof FormFiles, file: File | null) => {
    if (!file) {
      setFiles((prev) => ({
        ...prev,
        [field]: undefined,
      }));
      return;
    }

    // Define size limits in bytes according to your custom requirements
    const sizeLimits = {
      documentPhoto: 3 * 1024 * 1024, // 3MB
      documentCv: 2 * 1024 * 1024, // 2MB
      documentKtp: 1 * 1024 * 1024, // 1MB
      documentSkck: 2 * 1024 * 1024, // 2MB
      documentVaccine: 2 * 1024 * 1024, // 2MB
      supportingDocs: 3 * 1024 * 1024, // 3MB
    };

    // Define allowed file types for each field
    const allowedTypes = {
      documentPhoto: ["image/jpeg", "image/jpg", "image/png"],
      documentCv: ["application/pdf"],
      documentKtp: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
      documentSkck: ["application/pdf"],
      documentVaccine: [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ],
      supportingDocs: ["application/pdf"],
    };

    const maxSize = sizeLimits[field] || 3 * 1024 * 1024; // Default 3MB
    const allowedMimeTypes = allowedTypes[field] || [];

    // Check file type
    if (!allowedMimeTypes.includes(file.type)) {
      let allowedFormats = "";
      switch (field) {
        case "documentPhoto":
          allowedFormats = "JPG, PNG";
          break;
        case "documentCv":
          allowedFormats = "PDF";
          break;
        case "documentKtp":
          allowedFormats = "PDF, JPG, PNG";
          break;
        case "documentSkck":
          allowedFormats = "PDF";
          break;
        case "documentVaccine":
          allowedFormats = "PDF, JPG, PNG";
          break;
        case "supportingDocs":
          allowedFormats = "PDF";
          break;
        default:
          allowedFormats = "yang didukung";
      }

      Swal.fire({
        icon: "error",
        title: "Jenis File Tidak Valid!",
        text: `Mohon upload hanya file ${allowedFormats} untuk ${field
          .replace("document", "")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .trim()}.`,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

      Swal.fire({
        icon: "error",
        title: "Ukuran File Terlalu Besar!",
        html: `
          <p><strong>${
            file.name
          }</strong> berukuran <strong>${fileSizeMB}MB</strong></p>
          <p>Ukuran maksimal untuk ${field
            .replace("document", "")
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()
            .trim()} adalah <strong>${maxSizeMB}MB</strong></p>
        `,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    // Clear any previous errors
    if (errors.length > 0) {
      setErrors([]);
    }

    // Show success message for file upload
    Swal.fire({
      icon: "success",
      title: "File Berhasil Dipilih!",
      text: `${file.name} berhasil dipilih.`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  const handleCertificateChange = (certificate: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      certificate: checked
        ? [...(prev.certificate || []), certificate]
        : (prev.certificate || []).filter((c) => c !== certificate),
    }));
  };

  // Validate all documents are uploaded
  const validateDocuments = (): boolean => {
    const requiredDocuments = [
      { key: "documentPhoto", label: "Foto Profil" },
      { key: "documentCv", label: "CV/Resume" },
      { key: "documentKtp", label: "KTP (Kartu Identitas)" },
      { key: "documentSkck", label: "SKCK (Catatan Kepolisian)" },
      { key: "documentVaccine", label: "Sertifikat Vaksin" },
      { key: "supportingDocs", label: "Dokumen Pendukung" },
    ];

    const missingDocuments: string[] = [];

    requiredDocuments.forEach(({ key, label }) => {
      if (!files[key as keyof FormFiles]) {
        missingDocuments.push(label);
      }
    });

    if (missingDocuments.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Dokumen Belum Lengkap!",
        html: `
          <p>Mohon upload dokumen berikut:</p>
          <ul style="text-align: left; margin: 10px 0;">
            ${missingDocuments.map((doc) => `<li>• ${doc}</li>`).join("")}
          </ul>
        `,
        confirmButtonColor: "#2563eb",
      });
      return false;
    }

    return true;
  };

  const validateAndSubmit = async () => {
    // Validate form data
    const formErrors = PublicRecruitmentService.validateFormData(formData);

    // Validate all documents are uploaded
    if (!validateDocuments()) {
      setCurrentStep(3); // Go to document upload step
      return;
    }

    const fileErrors = PublicRecruitmentService.validateFileUploads(files);
    const allErrors = [...formErrors, ...fileErrors];

    if (allErrors.length > 0) {
      setErrors(allErrors);
      setCurrentStep(1); // Go back to first step to show errors

      Swal.fire({
        icon: "error",
        title: "Data Belum Lengkap!",
        html: `
          <p>Mohon perbaiki kesalahan berikut:</p>
          <ul style="text-align: left; margin: 10px 0;">
            ${allErrors.map((error) => `<li>• ${error}</li>`).join("")}
          </ul>
        `,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    // Show confirmation dialog before submitting
    const result = await Swal.fire({
      icon: "question",
      title: "Konfirmasi Pengiriman",
      text: "Apakah Anda yakin ingin mengirim lamaran ini? Data tidak dapat diubah setelah dikirim.",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Kirim Lamaran",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoading(true);
    setErrors([]);
    setUploadProgress({});

    try {
      // Use the new direct upload method
      const response =
        await PublicRecruitmentService.submitRecruitmentFormWithDirectUpload(
          formData,
          files,
          (fieldName, progress) => {
            setCurrentUploadingFile(fieldName);
            setUploadProgress((prev) => ({
              ...prev,
              [fieldName]: progress,
            }));
          }
        );

      setSubmissionResult({
        success: true,
        message: response.message,
        applicationId: response.applicationId,
      });
      setIsSubmitted(true);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Lamaran Berhasil Dikirim!",
        text: "Terima kasih atas lamaran Anda. Kami akan menghubungi Anda segera.",
        confirmButtonColor: "#10b981",
      });
    } catch (error: any) {
      const errorMessage = PublicRecruitmentService.formatErrorMessage(error);
      setSubmissionResult({
        success: false,
        message: errorMessage,
      });
      setErrors([errorMessage]);

      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Lamaran!",
        text: errorMessage,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress({});
      setCurrentUploadingFile("");
    }
  };

  const formatEnumValue = (value: string, isUppercase = false) => {
    const formatted = value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return isUppercase ? formatted.toUpperCase() : formatted;
  };

  const goToHomepage = () => {
    Swal.fire({
      icon: "question",
      title: "Kembali ke Beranda?",
      text: "Anda akan diarahkan ke halaman utama website.",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Kembali",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/tracking";
      }
    });
  };

  const resetForm = () => {
    Swal.fire({
      icon: "question",
      title: "Reset Formulir?",
      text: "Semua data yang telah diisi akan hilang. Apakah Anda yakin?",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Reset",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          fullName: "",
          birthPlace: "",
          birthDate: "",
          province: "",
          gender: "",
          religion: "",
          heightCm: 0,
          weightKg: 0,
          shirtSize: "",
          safetyShoesSize: "",
          pantsSize: "",
          address: "",
          whatsappNumber: "",
          certificate: [],
          education: "",
          schoolName: "",
          jurusan: "",
          workExperience: "",
          maritalStatus: "",
          appliedPosition: "",
          experienceLevel: "",
        });
        setFiles({});
        setIsSubmitted(false);
        setSubmissionResult(null);
        setErrors([]);
        setCurrentStep(1);
        setUploadProgress({});
        setCurrentUploadingFile("");

        Swal.fire({
          icon: "success",
          title: "Formulir Berhasil Direset!",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      }
    });
  };

  // Helper function to get file format text for each document type
  const getFileFormatText = (key: string) => {
    switch (key) {
      case "documentPhoto":
        return "JPG, PNG saja. Ukuran maksimal: 3MB";
      case "documentCv":
        return "PDF saja. Ukuran maksimal: 2MB";
      case "documentKtp":
        return "PDF, JPG, PNG. Ukuran maksimal: 1MB";
      case "documentSkck":
        return "PDF saja. Ukuran maksimal: 2MB";
      case "documentVaccine":
        return "PDF, JPG, PNG. Ukuran maksimal: 2MB";
      case "supportingDocs":
        return "PDF saja. Ukuran maksimal: 3MB - NPWP, Surat Keterangan Kerja dan Sertifikat masukan disini";
      default:
        return "Format yang didukung: PDF, JPG, PNG. Ukuran maksimal: 5MB";
    }
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      const requiredFields = [
        "fullName",
        "birthPlace",
        "birthDate",
        "province",
        "gender",
        "heightCm",
        "weightKg",
        "address",
        "whatsappNumber",
        "maritalStatus",
      ];
      const missingFields = requiredFields.filter((field) => {
        const value = formData[field as keyof PublicRecruitmentFormData];
        return !value || (typeof value === "number" && value === 0);
      });

      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Data Belum Lengkap!",
          text: "Mohon lengkapi semua data pribadi yang wajib diisi sebelum melanjutkan.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }
    } else if (currentStep === 2) {
      const requiredFields = [
        "education",
        "schoolName",
        "appliedPosition",
        "experienceLevel",
        "shirtSize",
        "safetyShoesSize",
        "pantsSize",
      ];
      const missingFields = requiredFields.filter((field) => {
        const value = formData[field as keyof PublicRecruitmentFormData];
        return !value;
      });

      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Data Profesional Belum Lengkap!",
          text: "Mohon lengkapi semua data profesional yang wajib diisi sebelum melanjutkan.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  // Calculate overall upload progress
  const getOverallProgress = () => {
    const progressValues = Object.values(uploadProgress);
    if (progressValues.length === 0) return 0;
    return Math.round(
      progressValues.reduce((sum, progress) => sum + progress, 0) /
        progressValues.length
    );
  };

  if (!options) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat formulir lamaran...</p>
        </div>
      </div>
    );
  }

  // Use the separate SubmittedApp component for success page
  if (isSubmitted && submissionResult?.success) {
    return (
      <SubmittedApp
        submissionResult={{
          message: submissionResult.message,
          applicationId: submissionResult.applicationId,
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bergabunglah dengan PT. Batara Dharma Persada
          </h1>
          <p className="text-xl text-gray-600">
            Kirimkan lamaran Anda dan ambil langkah selanjutnya dalam karir
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-0.5 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-8 text-sm">
            <div
              className={`text-center ${
                currentStep >= 1
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              <p>Data Pribadi</p>
            </div>
            <div
              className={`text-center ${
                currentStep >= 2
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              <p>Data Profesional</p>
            </div>
            <div
              className={`text-center ${
                currentStep >= 3
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              <p>Upload Dokumen</p>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold mb-2">
                  Mohon perbaiki kesalahan berikut:
                </h3>
                <ul className="text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-600" />
                Informasi Pribadi
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) =>
                      handleInputChange("birthPlace", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan tempat lahir Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="MALE">LAKI-LAKI</option>
                    <option value="FEMALE">PEREMPUAN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agama *
                  </label>
                  <select
                    value={formData.religion}
                    onChange={(e) =>
                      handleInputChange("religion", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Agama</option>
                    {options.religion.map((religion) => (
                      <option key={religion} value={religion}>
                        {formatEnumValue(religion, true)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provinsi *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) =>
                      handleInputChange("province", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Provinsi</option>
                    {options.province.map((province) => (
                      <option key={province} value={province}>
                        {formatEnumValue(province, true)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tinggi Badan (cm) *
                  </label>
                  <input
                    type="number"
                    value={formData.heightCm || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "heightCm",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="170"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Berat Badan (kg) *
                  </label>
                  <input
                    type="number"
                    value={formData.weightKg || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "weightKg",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="70"
                    min="30"
                    max="200"
                  />
                </div>

                <MaritalStatusField
                  formData={formData}
                  handleInputChange={handleInputChange}
                  options={options}
                  formatMaritalStatus={formatMaritalStatus}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) =>
                      handleInputChange("whatsappNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+62812345678 atau 08123456789"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan alamat lengkap Anda"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
                Informasi Profesional
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat Pendidikan *
                  </label>
                  <select
                    value={formData.education}
                    onChange={(e) =>
                      handleInputChange("education", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Pendidikan</option>
                    {options.educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Sekolah/Universitas *
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) =>
                      handleInputChange("schoolName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama institusi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jurusan Pendidikan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.jurusan}
                    onChange={(e) =>
                      handleInputChange("jurusan", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama jurusan di sekolah anda jika ada"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posisi yang Dilamar *
                  </label>
                  <select
                    value={formData.appliedPosition}
                    onChange={(e) =>
                      handleInputChange("appliedPosition", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Posisi</option>
                    {options.positions
                      .sort((a, b) =>
                        formatEnumValue(a, true).localeCompare(
                          formatEnumValue(b, true)
                        )
                      )
                      .map((position) => (
                        <option key={position} value={position}>
                          {formatEnumValue(position, true)}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level Pengalaman *
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      handleInputChange("experienceLevel", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Pengalaman</option>
                    {options.experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {formatEnumValue(level)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Uniform Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ukuran Baju *
                  </label>
                  <select
                    value={formData.shirtSize}
                    onChange={(e) =>
                      handleInputChange("shirtSize", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Ukuran</option>
                    {options.shirtSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ukuran Sepatu Safety *
                  </label>
                  <select
                    value={formData.safetyShoesSize}
                    onChange={(e) =>
                      handleInputChange("safetyShoesSize", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Ukuran</option>
                    {options.safetyShoeSizes.map((size) => (
                      <option key={size} value={size}>
                        {size.replace("SIZE_", "")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ukuran Celana *
                  </label>
                  <select
                    value={formData.pantsSize}
                    onChange={(e) =>
                      handleInputChange("pantsSize", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Ukuran</option>
                    {options.pantsSizes.map((size) => (
                      <option key={size} value={size}>
                        {size.replace("SIZE_", "")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengalaman Kerja (Opsional)
                </label>

                {/* Example text with specific formatting */}
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-bold">Contoh Penulisan:</span>
                  </p>
                  <div className="text-sm text-blue-700 mt-1 ml-4">
                    <p>1. Helper Operator Double Trailer - 2 Tahun - PT.XXX</p>
                    <p>2. Operator Double Trailer - 2 Tahun - PT.XXX</p>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.workExperience}
                    onChange={(content) =>
                      handleQuillChange("workExperience", content)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Jelaskan pengalaman kerja yang relevan, posisi yang pernah dipegang, pencapaian, dan keterampilan yang diperoleh..."
                    style={{
                      backgroundColor: "white",
                      minHeight: "120px",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Gunakan format teks untuk membuat pengalaman kerja lebih
                  terstruktur dan mudah dibaca
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sertifikat (Opsional)
                </label>

                {/* Fixed height container with scroll */}
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {options.certificates.map((cert) => (
                      <label
                        key={cert}
                        className="flex items-center hover:bg-white hover:shadow-sm rounded p-2 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(formData.certificate || []).includes(cert)}
                          onChange={(e) =>
                            handleCertificateChange(cert, e.target.checked)
                          }
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 leading-tight">
                          {formatEnumValue(cert, true)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {(formData.certificate || []).length} sertifikat dipilih
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Upload Dokumen
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-yellow-800 font-semibold mb-1">
                      Semua Dokumen Wajib Diupload!
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      Pastikan semua dokumen telah diupload dengan format dan
                      ukuran yang sesuai sebelum mengirim lamaran.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    key: "documentPhoto",
                    label: "Foto Profil",
                    required: true,
                  },
                  { key: "documentCv", label: "CV/Resume", required: true },
                  {
                    key: "documentKtp",
                    label: "KTP (Kartu Identitas)",
                    required: true,
                  },
                  {
                    key: "documentSkck",
                    label: "SKCK (Catatan Kepolisian)",
                    required: true,
                  },
                  {
                    key: "documentVaccine",
                    label: "Sertifikat Vaksin",
                    required: true,
                  },
                  {
                    key: "supportingDocs",
                    label: "Dokumen Pendukung",
                    required: true,
                  },
                ].map(({ key, label, required }) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-4 ${
                      files[key as keyof FormFiles]
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}{" "}
                      {required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileChange(
                            key as keyof FormFiles,
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                        id={key}
                      />
                      <label
                        htmlFor={key}
                        className={`cursor-pointer px-4 py-2 rounded-lg border transition-colors flex items-center ${
                          files[key as keyof FormFiles]
                            ? "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            : "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        }`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {files[key as keyof FormFiles]
                          ? "Ganti File"
                          : "Pilih File"}
                      </label>
                      {files[key as keyof FormFiles] && (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 truncate max-w-xs">
                            {files[key as keyof FormFiles]?.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getFileFormatText(key)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Enhanced Upload Progress Display */}
              {isLoading && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Loader className="animate-spin h-5 w-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="text-blue-800 font-medium">
                        Mengirim lamaran Anda...
                      </p>
                      {currentUploadingFile && (
                        <p className="text-blue-600 text-sm">
                          Mengupload:{" "}
                          {currentUploadingFile
                            .replace("document", "")
                            .replace(/([A-Z])/g, " $1")
                            .toLowerCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="mb-3">
                    <div className="bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getOverallProgress()}%` }}
                      />
                    </div>
                    <p className="text-blue-600 text-sm mt-1">
                      {getOverallProgress()}% selesai
                    </p>
                  </div>

                  {/* Individual File Progress */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(uploadProgress).map(
                        ([fieldName, progress]) => (
                          <div
                            key={fieldName}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-blue-700">
                              {fieldName
                                .replace("document", "")
                                .replace(/([A-Z])/g, " $1")
                                .toLowerCase()}
                            </span>
                            <span className="text-blue-600 font-medium">
                              {progress}%
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sebelumnya
            </button>

            <div className="flex space-x-3">
              {currentStep < 3 && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
                >
                  Reset Form
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  onClick={validateAndSubmit}
                  disabled={isLoading}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Lamaran"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Quill Styles */}
      <style jsx global>{`
        .ql-editor {
          min-height: 80px;
          font-size: 14px;
          line-height: 1.5;
        }

        .ql-toolbar {
          border-top: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-bottom: none;
        }

        .ql-container {
          border-bottom: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-top: none;
          font-size: 14px;
        }

        .ql-editor.ql-blank::before {
          font-style: italic;
          color: #9ca3af;
        }

        .ql-editor p {
          margin-bottom: 8px;
        }

        .ql-editor ul,
        .ql-editor ol {
          margin-bottom: 8px;
        }

        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3 {
          margin-bottom: 8px;
          font-weight: 600;
        }

        .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .ql-snow .ql-tooltip {
          z-index: 1000;
        }

        .ql-snow .ql-picker {
          color: #374151;
        }

        .ql-snow .ql-stroke {
          stroke: #374151;
        }

        .ql-snow .ql-fill {
          fill: #374151;
        }
      `}</style>
    </div>
  );
};

export default PublicRecruitmentPage;
