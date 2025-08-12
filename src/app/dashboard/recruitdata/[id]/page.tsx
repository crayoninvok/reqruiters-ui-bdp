"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RecruitmentFormService } from "@/services/recruitment.service";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";
import Swal from "sweetalert2";

export default function RecruitmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const [recruitmentForm, setRecruitmentForm] =
    useState<RecruitmentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);

  const id = params.id as string;

  // Enhanced print styles with document support
  useEffect(() => {
    const printStyles = `
      <style id="print-styles">
        @media print {
          body { font-size: 12px !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-break { page-break-before: always; }
          .print-avoid-break { page-break-inside: avoid; }
          .print-photo { 
            width: 120px !important; 
            height: 120px !important; 
            float: right !important;
            margin: 0 0 10px 10px !important;
          }
          .print-header {
            border-bottom: 2px solid #000 !important;
            padding-bottom: 10px !important;
            margin-bottom: 20px !important;
          }
          .print-section {
            margin-bottom: 15px !important;
            border: 1px solid #ccc !important;
            padding: 10px !important;
          }
          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 15px !important;
          }
          .print-grid-3 {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 10px !important;
          }
          .print-title {
            font-weight: bold !important;
            font-size: 14px !important;
            margin-bottom: 8px !important;
            color: #000 !important;
          }
          .print-label {
            font-weight: 600 !important;
            color: #333 !important;
            margin-bottom: 2px !important;
          }
          .print-value {
            color: #000 !important;
            margin-bottom: 8px !important;
          }
          .print-certificates {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 5px !important;
          }
          .print-cert-item {
            background: #f0f0f0 !important;
            padding: 2px 6px !important;
            border-radius: 3px !important;
            font-size: 10px !important;
            color: #000 !important;
          }
          .print-document {
            width: 100% !important;
            height: 600px !important;
            border: 1px solid #ccc !important;
            margin: 10px 0 !important;
          }
          .print-document-section {
            page-break-before: always !important;
            margin-top: 20px !important;
          }
          .print-document-title {
            font-weight: bold !important;
            font-size: 16px !important;
            margin-bottom: 10px !important;
            text-align: center !important;
            border-bottom: 1px solid #000 !important;
            padding-bottom: 5px !important;
          }
        }
      </style>
    `;

    const existingStyles = document.getElementById("print-styles");
    if (existingStyles) {
      existingStyles.remove();
    }

    document.head.insertAdjacentHTML("beforeend", printStyles);

    return () => {
      const styles = document.getElementById("print-styles");
      if (styles) {
        styles.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (id) {
      fetchRecruitmentForm();
    }
  }, [id]);

  const fetchRecruitmentForm = async () => {
    try {
      setLoading(true);
      const response = await RecruitmentFormService.getRecruitmentFormById(id);
      setRecruitmentForm(response.recruitmentForm);
    } catch (error) {
      console.error("Error fetching recruitment form:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch recruitment data",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      router.push("/dashboard/recruitdata");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: RecruitmentStatus) => {
    if (!recruitmentForm) return;

    try {
      await RecruitmentFormService.updateRecruitmentStatus(id, newStatus);
      setRecruitmentForm((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
      Swal.fire({
        title: "Success",
        text: "Status updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const getStatusColor = (status: RecruitmentStatus) => {
    switch (status) {
      case RecruitmentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case RecruitmentStatus.ON_PROGRESS:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case RecruitmentStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const convertToPublicUrl = (cloudinaryUrl: string): string => {
    if (!cloudinaryUrl.includes("res.cloudinary.com")) {
      return cloudinaryUrl;
    }

    if (
      cloudinaryUrl.includes("/upload/") &&
      !cloudinaryUrl.includes("fl_attachment")
    ) {
      return cloudinaryUrl.replace("/upload/", "/upload/fl_attachment/");
    }

    return cloudinaryUrl;
  };

  const downloadDocument = async (url: string, filename: string) => {
    try {
      const publicUrl = convertToPublicUrl(url);

      const link = document.createElement("a");
      link.href = publicUrl;
      link.download = filename;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.open(publicUrl, "_blank");
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);

      Swal.fire({
        title: "Download Document",
        html: `
          <p>Click the button below to download the document:</p>
          <a href="${convertToPublicUrl(url)}" target="_blank" 
             style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 10px;">
            Download ${filename}
          </a>
        `,
        icon: "info",
        showConfirmButton: true,
        confirmButtonText: "Close",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  const viewDocument = (url: string, name: string, type: "image" | "pdf") => {
    setCurrentDocument({ url, name, type });
    setShowDocumentModal(true);
  };

  const getFileType = (url: string): "image" | "pdf" => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return "image";
    }
    return "pdf";
  };

  // Photo Modal Component
  const PhotoModal = () => {
    if (!showPhotoModal || !recruitmentForm?.documentPhotoUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 no-print">
        <div className="relative max-w-4xl max-h-full p-4">
          <button
            onClick={() => setShowPhotoModal(false)}
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={recruitmentForm.documentPhotoUrl}
            alt={`${recruitmentForm.fullName}'s photo`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() =>
                downloadDocument(
                  recruitmentForm.documentPhotoUrl!,
                  `${recruitmentForm.fullName}-photo.jpg`
                )
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Download Photo
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Document Modal Component
  const DocumentModal = () => {
    if (!showDocumentModal || !currentDocument) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 no-print">
        <div className="relative w-11/12 h-5/6 bg-white rounded-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">{currentDocument.name}</h3>
            <button
              onClick={() => setShowDocumentModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 h-full">
            {currentDocument.type === "image" ? (
              <img
                src={currentDocument.url}
                alt={currentDocument.name}
                className="max-w-full max-h-full object-contain mx-auto"
              />
            ) : (
              <iframe
                src={`${currentDocument.url}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title={currentDocument.name}
              />
            )}
          </div>
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() =>
                downloadDocument(currentDocument.url, currentDocument.name)
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!recruitmentForm) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recruitment form not found
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print-header">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2 no-print"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to List
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {recruitmentForm.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Application submitted on {formatDate(recruitmentForm.createdAt)}
            </p>
            {/* Photo in print mode */}
            {recruitmentForm.documentPhotoUrl && (
              <div className="hidden print:block print-photo">
                <img
                  src={recruitmentForm.documentPhotoUrl}
                  alt={`${recruitmentForm.fullName}'s photo`}
                  className="w-full h-full object-cover rounded border"
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3 no-print">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                recruitmentForm.status
              )}`}
            >
              {recruitmentForm.status.replace("_", " ")}
            </span>
            <select
              value={recruitmentForm.status}
              onChange={(e) =>
                handleStatusUpdate(e.target.value as RecruitmentStatus)
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(RecruitmentStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-title">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-grid">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium print-value">
                    {recruitmentForm.fullName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Birth Place & Date
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.birthPlace},{" "}
                    {formatDate(recruitmentForm.birthDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Province
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.province.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    WhatsApp Number
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.whatsappNumber}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Address
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Physical & Size Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-title">
                Physical & Size Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print-grid">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Height
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium print-value">
                    {recruitmentForm.heightCm} cm
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Weight
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium print-value">
                    {recruitmentForm.weightKg} kg
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Shirt Size
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.shirtSize}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Safety Shoes
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.safetyShoesSize.replace("SIZE_", "")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Pants Size
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.pantsSize.replace("SIZE_", "")}
                  </p>
                </div>
              </div>
            </div>

            {/* Education & Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-title">
                Education & Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-grid">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Education Level
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium print-value">
                    {recruitmentForm.education}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    School Name
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.schoolName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Experience Level
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.experienceLevel?.replace("_", " ") ||
                      "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Applied Position
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.appliedPosition?.replace(/_/g, " ") ||
                      "Not specified"}
                  </p>
                </div>
                {recruitmentForm.workExperience && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                      Work Experience
                    </label>
                    <p className="text-gray-900 dark:text-white print-value">
                      {recruitmentForm.workExperience}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-title">
                Certificates
              </h2>
              <div className="flex flex-wrap gap-2 print-certificates">
                {recruitmentForm.certificate.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full print-cert-item"
                  >
                    {cert.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 no-print">
            {/* Candidate Photo */}
            {recruitmentForm.documentPhotoUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Candidate Photo
                </h3>
                <div className="flex justify-center">
                  <div
                    className="w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowPhotoModal(true)}
                  >
                    <img
                      src={recruitmentForm.documentPhotoUrl}
                      alt={`${recruitmentForm.fullName}'s photo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-avatar.jpg";
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-center space-y-2">
                  <button
                    onClick={() => setShowPhotoModal(true)}
                    className="block w-full text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View Full Size
                  </button>
                  <button
                    onClick={() =>
                      downloadDocument(
                        recruitmentForm.documentPhotoUrl!,
                        `${recruitmentForm.fullName}-photo.jpg`
                      )
                    }
                    className="block w-full text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Download Photo
                  </button>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      recruitmentForm.status
                    )}`}
                  >
                    {recruitmentForm.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Marital Status:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {recruitmentForm.maritalStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Applied:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(recruitmentForm.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Updated:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(recruitmentForm.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documents
              </h3>
              <div className="space-y-3">
                {recruitmentForm.documentCvUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      CV
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.documentCvUrl!,
                            "CV",
                            getFileType(recruitmentForm.documentCvUrl!)
                          )
                        }
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadDocument(
                            recruitmentForm.documentCvUrl!,
                            "cv.pdf"
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
                {recruitmentForm.documentKtpUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      KTP
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.documentKtpUrl!,
                            "KTP",
                            getFileType(recruitmentForm.documentKtpUrl!)
                          )
                        }
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadDocument(
                            recruitmentForm.documentKtpUrl!,
                            "ktp.jpg"
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
                {recruitmentForm.documentSkckUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      SKCK
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.documentSkckUrl!,
                            "SKCK",
                            getFileType(recruitmentForm.documentSkckUrl!)
                          )
                        }
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadDocument(
                            recruitmentForm.documentSkckUrl!,
                            "skck.pdf"
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
                {recruitmentForm.documentVaccineUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Vaccine Certificate
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.documentVaccineUrl!,
                            "Vaccine Certificate",
                            getFileType(recruitmentForm.documentVaccineUrl!)
                          )
                        }
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadDocument(
                            recruitmentForm.documentVaccineUrl!,
                            "vaccine.pdf"
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
                {recruitmentForm.supportingDocsUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Supporting Docs
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.supportingDocsUrl!,
                            "Supporting Documents",
                            getFileType(recruitmentForm.supportingDocsUrl!)
                          )
                        }
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadDocument(
                            recruitmentForm.supportingDocsUrl!,
                            "supporting.pdf"
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Print Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Print-only document sections */}
        <div className="hidden print:block">
          {recruitmentForm.documentCvUrl && (
            <div className="print-document-section">
              <h2 className="print-document-title">CV Document</h2>
              <iframe
                src={`${recruitmentForm.documentCvUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="print-document"
                title="CV Document"
              />
            </div>
          )}

          {recruitmentForm.documentKtpUrl && (
            <div className="print-document-section">
              <h2 className="print-document-title">KTP Document</h2>
              {getFileType(recruitmentForm.documentKtpUrl) === "image" ? (
                <img
                  src={recruitmentForm.documentKtpUrl}
                  alt="KTP Document"
                  className="print-document"
                  style={{
                    height: "400px",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              ) : (
                <iframe
                  src={`${recruitmentForm.documentKtpUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="print-document"
                  title="KTP Document"
                />
              )}
            </div>
          )}

          {recruitmentForm.documentSkckUrl && (
            <div className="print-document-section">
              <h2 className="print-document-title">SKCK Document</h2>
              <iframe
                src={`${recruitmentForm.documentSkckUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="print-document"
                title="SKCK Document"
              />
            </div>
          )}

          {recruitmentForm.documentVaccineUrl && (
            <div className="print-document-section">
              <h2 className="print-document-title">Vaccine Certificate</h2>
              <iframe
                src={`${recruitmentForm.documentVaccineUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="print-document"
                title="Vaccine Certificate"
              />
            </div>
          )}

          {recruitmentForm.supportingDocsUrl && (
            <div className="print-document-section">
              <h2 className="print-document-title">Supporting Documents</h2>
              <iframe
                src={`${recruitmentForm.supportingDocsUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="print-document"
                title="Supporting Documents"
              />
            </div>
          )}
        </div>
      </div>

      {/* Photo Modal */}
      <PhotoModal />

      {/* Document Modal */}
      <DocumentModal />
    </>
  );
}
