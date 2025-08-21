"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecruitmentFormService } from "@/services/createform.service";
import {
  Province,
  ShirtSize,
  SafetyShoesSize,
  PantsSize,
  Certificate,
  EducationLevel,
  MaritalStatus,
  Position,
  ExperienceLevel,
  Gender,
} from "@/types/types";
import {
  Upload,
  FileText,
  User,
  MapPin,
  Briefcase,
  Award,
  Phone,
} from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { withAdminGuard, withAuthGuard } from "@/components/withGuard";

function RecruitmentFormPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    birthPlace: "",
    birthDate: "",
    province: "" as Province,
    gender: "" as Gender,
    heightCm: "",
    weightKg: "",
    shirtSize: "" as ShirtSize,
    safetyShoesSize: "" as SafetyShoesSize,
    pantsSize: "" as PantsSize,
    address: "",
    whatsappNumber: "",
    certificate: [] as Certificate[],
    education: "" as EducationLevel,
    schoolName: "",
    jurusan: "",
    workExperience: "",
    maritalStatus: "" as MaritalStatus,
    appliedPosition: "" as Position,
    experienceLevel: "" as ExperienceLevel,
  });

  // File state
  const [files, setFiles] = useState<{
    documentPhoto?: File;
    documentCv?: File;
    documentKtp?: File;
    documentSkck?: File;
    documentVaccine?: File;
    supportingDocs?: File;
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificateChange = (certificate: Certificate) => {
    setFormData((prev) => {
      const certificates = prev.certificate.includes(certificate)
        ? prev.certificate.filter((c) => c !== certificate)
        : [...prev.certificate, certificate];
      return { ...prev, certificate: certificates };
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create FormData object
      const submitData = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "certificate") {
          // Handle certificate array
          (value as Certificate[]).forEach((cert) => {
            submitData.append("certificate", cert);
          });
        } else if (value) {
          submitData.append(key, value.toString());
        }
      });

      // Add files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file);
        }
      });

      await RecruitmentFormService.createRecruitmentForm(submitData);
      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        router.push("/terima-kasih"); // Redirect to thank you page
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Lamaran Berhasil Dikirim!
          </h2>
          <p className="text-slate-400">
            Terima kasih atas lamaran Anda. Kami akan meninjau dan menghubungi
            Anda segera.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              Formulir Lamaran Kerja
            </h1>
            <p className="text-blue-100 mt-2">
              Mohon lengkapi semua informasi yang diperlukan
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-8">
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 text-red-300">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-600">
                <User className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">
                  Informasi Pribadi
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Provinsi *
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Provinsi</option>
                    {Object.values(Province).map((province) => (
                      <option key={province} value={province}>
                        {province.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Jenis Kelamin *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    {Object.values(Gender).map((gender) => (
                      <option key={gender} value={gender}>
                        {gender.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tinggi Badan (cm) *
                  </label>
                  <input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleInputChange}
                    min="100"
                    max="250"
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Berat Badan (kg) *
                  </label>
                  <input
                    type="number"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleInputChange}
                    min="30"
                    max="200"
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status Pernikahan *
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Status</option>
                    {Object.values(MaritalStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Alamat *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Uniform Sizes */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-600">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-white">
                  Ukuran Seragam
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ukuran Baju *
                  </label>
                  <select
                    name="shirtSize"
                    value={formData.shirtSize}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Ukuran</option>
                    {Object.values(ShirtSize).map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ukuran Sepatu Safety *
                  </label>
                  <select
                    name="safetyShoesSize"
                    value={formData.safetyShoesSize}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Ukuran</option>
                    {Object.values(SafetyShoesSize).map((size) => (
                      <option key={size} value={size}>
                        {size.replace("SIZE_", "")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ukuran Celana *
                  </label>
                  <select
                    name="pantsSize"
                    value={formData.pantsSize}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Ukuran</option>
                    {Object.values(PantsSize).map((size) => (
                      <option key={size} value={size}>
                        {size.replace("SIZE_", "")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Education & Experience */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-600">
                <Award className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">
                  Pendidikan & Pengalaman
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tingkat Pendidikan *
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Pendidikan</option>
                    {Object.values(EducationLevel).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nama Sekolah *
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Jurusan Pendidikan (*Opsional)
                  </label>
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Posisi yang Dilamar *
                  </label>
                  <select
                    name="appliedPosition"
                    value={formData.appliedPosition}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Posisi</option>
                    {Object.values(Position).map((position) => (
                      <option key={position} value={position}>
                        {position.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Level Pengalaman *
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Pengalaman</option>
                    {Object.values(ExperienceLevel).map((level) => (
                      <option key={level} value={level}>
                        {level.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pengalaman Kerja
                </label>
                <textarea
                  name="workExperience"
                  value={formData.workExperience}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Jelaskan pengalaman kerja Anda (opsional)"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Certificates */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sertifikat
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(Certificate).map((cert) => (
                    <label
                      key={cert}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.certificate.includes(cert)}
                        onChange={() => handleCertificateChange(cert)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600 rounded"
                      />
                      <span className="text-sm text-slate-300">
                        {cert.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-600">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">
                  Upload Dokumen
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "documentPhoto", label: "Foto", required: false },
                  { name: "documentCv", label: "CV/Resume", required: false },
                  {
                    name: "documentKtp",
                    label: "KTP/Kartu Identitas",
                    required: false,
                  },
                  { name: "documentSkck", label: "SKCK", required: false },
                  {
                    name: "documentVaccine",
                    label: "Sertifikat Vaksin",
                    required: false,
                  },
                  {
                    name: "supportingDocs",
                    label: "Dokumen Pendukung",
                    required: false,
                  },
                ].map(({ name, label, required }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {label} {required && "*"}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, name)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id={name}
                      />
                      <label
                        htmlFor={name}
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-slate-700/50 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-300">
                          {files[name as keyof typeof files]
                            ? files[name as keyof typeof files]?.name
                            : `Pilih ${label}`}
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Mengirim...
                  </div>
                ) : (
                  "Kirim Lamaran"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withAuthGuard(RecruitmentFormPage);
