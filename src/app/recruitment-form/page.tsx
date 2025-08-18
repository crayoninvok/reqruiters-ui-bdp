"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Swal from "sweetalert2";
import SubmittedApp from "@/components/SubmittedApp";

interface FormOptions {
  provinces: string[];
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

  // Load form options on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await PublicRecruitmentService.getFormOptions();
        setOptions(response.options);
      } catch (error) {
        console.error("Failed to load form options:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Gagal memuat data formulir. Silakan refresh halaman.',
          confirmButtonColor: '#2563eb'
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
        icon: 'error',
        title: 'Jenis File Tidak Valid!',
        text: `Mohon upload hanya file ${allowedFormats} untuk ${field
          .replace("document", "")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .trim()}.`,
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      Swal.fire({
        icon: 'error',
        title: 'Ukuran File Terlalu Besar!',
        html: `
          <p><strong>${file.name}</strong> berukuran <strong>${fileSizeMB}MB</strong></p>
          <p>Ukuran maksimal untuk ${field
            .replace("document", "")
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()
            .trim()} adalah <strong>${maxSizeMB}MB</strong></p>
        `,
        confirmButtonColor: '#2563eb'
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
      icon: 'success',
      title: 'File Berhasil Dipilih!',
      text: `${file.name} berhasil dipilih.`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
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
      { key: 'documentPhoto', label: 'Foto Profil' },
      { key: 'documentCv', label: 'CV/Resume' },
      { key: 'documentKtp', label: 'KTP (Kartu Identitas)' },
      { key: 'documentSkck', label: 'SKCK (Catatan Kepolisian)' },
      { key: 'documentVaccine', label: 'Sertifikat Vaksin' },
      { key: 'supportingDocs', label: 'Dokumen Pendukung' }
    ];

    const missingDocuments: string[] = [];

    requiredDocuments.forEach(({ key, label }) => {
      if (!files[key as keyof FormFiles]) {
        missingDocuments.push(label);
      }
    });

    if (missingDocuments.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Dokumen Belum Lengkap!',
        html: `
          <p>Mohon upload dokumen berikut:</p>
          <ul style="text-align: left; margin: 10px 0;">
            ${missingDocuments.map(doc => `<li>• ${doc}</li>`).join('')}
          </ul>
        `,
        confirmButtonColor: '#2563eb'
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
        icon: 'error',
        title: 'Data Belum Lengkap!',
        html: `
          <p>Mohon perbaiki kesalahan berikut:</p>
          <ul style="text-align: left; margin: 10px 0;">
            ${allErrors.map(error => `<li>• ${error}</li>`).join('')}
          </ul>
        `,
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    // Show confirmation dialog before submitting
    const result = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi Pengiriman',
      text: 'Apakah Anda yakin ingin mengirim lamaran ini? Data tidak dapat diubah setelah dikirim.',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Kirim Lamaran',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoading(true);
    setErrors([]);
    setUploadProgress({});

    try {
      // Use the new direct upload method
      const response = await PublicRecruitmentService.submitRecruitmentFormWithDirectUpload(
        formData,
        files,
        (fieldName, progress) => {
          setCurrentUploadingFile(fieldName);
          setUploadProgress(prev => ({
            ...prev,
            [fieldName]: progress
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
        icon: 'success',
        title: 'Lamaran Berhasil Dikirim!',
        text: 'Terima kasih atas lamaran Anda. Kami akan menghubungi Anda segera.',
        confirmButtonColor: '#10b981'
      });

    } catch (error: any) {
      const errorMessage = PublicRecruitmentService.formatErrorMessage(error);
      setSubmissionResult({
        success: false,
        message: errorMessage,
      });
      setErrors([errorMessage]);

      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim Lamaran!',
        text: errorMessage,
        confirmButtonColor: '#dc2626'
      });

    } finally {
      setIsLoading(false);
      setUploadProgress({});
      setCurrentUploadingFile("");
    }
  };

  const formatEnumValue = (value: string) => {
    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const goToHomepage = () => {
    Swal.fire({
      icon: 'question',
      title: 'Kembali ke Beranda?',
      text: 'Anda akan diarahkan ke halaman utama website.',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Kembali',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/tracking";
      }
    });
  };

  const resetForm = () => {
    Swal.fire({
      icon: 'question',
      title: 'Reset Formulir?',
      text: 'Semua data yang telah diisi akan hilang. Apakah Anda yakin?',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Reset',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          fullName: "",
          birthPlace: "",
          birthDate: "",
          province: "",
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
          icon: 'success',
          title: 'Formulir Berhasil Direset!',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
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
      const requiredFields = ['fullName', 'birthPlace', 'birthDate', 'province', 'heightCm', 'weightKg', 'address', 'whatsappNumber', 'maritalStatus'];
      const missingFields = requiredFields.filter(field => {
        const value = formData[field as keyof PublicRecruitmentFormData];
        return !value || (typeof value === 'number' && value === 0);
      });

      if (missingFields.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Data Belum Lengkap!',
          text: 'Mohon lengkapi semua data pribadi yang wajib diisi sebelum melanjutkan.',
          confirmButtonColor: '#2563eb'
        });
        return;
      }
    } else if (currentStep === 2) {
      const requiredFields = ['education', 'schoolName', 'appliedPosition', 'experienceLevel', 'shirtSize', 'safetyShoesSize', 'pantsSize'];
      const missingFields = requiredFields.filter(field => {
        const value = formData[field as keyof PublicRecruitmentFormData];
        return !value;
      });

      if (missingFields.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Data Profesional Belum Lengkap!',
          text: 'Mohon lengkapi semua data profesional yang wajib diisi sebelum melanjutkan.',
          confirmButtonColor: '#2563eb'
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
    return Math.round(progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length);
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
          applicationId: submissionResult.applicationId
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
                    {options.provinces.map((province) => (
                      <option key={province} value={province}>
                        {formatEnumValue(province)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pernikahan *
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) =>
                      handleInputChange("maritalStatus", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Status</option>
                    {options.maritalStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatEnumValue(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan alamat lengkap Anda"
                />
              </div>

              <div className="mt-6">
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
                    {options.positions.map((position) => (
                      <option key={position} value={position}>
                        {formatEnumValue(position)}
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
                <textarea
                  value={formData.workExperience}
                  onChange={(e) =>
                    handleInputChange("workExperience", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jelaskan pengalaman kerja yang relevan"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sertifikat (Opsional)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {options.certificates.map((cert) => (
                    <label key={cert} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.certificate || []).includes(cert)}
                        onChange={(e) =>
                          handleCertificateChange(cert, e.target.checked)
                        }
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        {formatEnumValue(cert)}
                      </span>
                    </label>
                  ))}
                </div>
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
                      Pastikan semua dokumen telah diupload dengan format dan ukuran yang sesuai sebelum mengirim lamaran.
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
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label} {required && <span className="text-red-500">*</span>}
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
                            ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
                        }`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {files[key as keyof FormFiles] ? 'Ganti File' : 'Pilih File'}
                      </label>
                      {files[key as keyof FormFiles] && (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 truncate">
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
                          Mengupload: {currentUploadingFile.replace('document', '').replace(/([A-Z])/g, ' $1').toLowerCase()}
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
                      {Object.entries(uploadProgress).map(([fieldName, progress]) => (
                        <div key={fieldName} className="flex items-center justify-between text-sm">
                          <span className="text-blue-700">
                            {fieldName.replace('document', '').replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <span className="text-blue-600 font-medium">{progress}%</span>
                        </div>
                      ))}
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
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors`}
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
    </div>
  );
};

export default PublicRecruitmentPage;