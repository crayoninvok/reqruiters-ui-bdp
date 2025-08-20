"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RecruitmentFormService } from "@/services/recruitment.service";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";
import Swal from "sweetalert2";
import { useAuth } from "@/context/useAuth";
import { withAuthGuard } from "@/components/withGuard";
import dynamic from "next/dynamic";

const calculateBMI = (heightCm: number, weightKg: number) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5)
    return {
      category: "Underweight",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    };
  if (bmi < 25)
    return {
      category: "Normal",
      color: "text-green-600 bg-green-50 border-green-200",
    };
  if (bmi < 30)
    return {
      category: "Overweight",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    };
  return { category: "Obese", color: "text-red-600 bg-red-50 border-red-200" };
};

const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) return "Below normal weight";
  if (bmi < 25) return "Healthy weight range";
  if (bmi < 30) return "Above normal weight";
  return "Significantly above normal weight";
};
// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-20 rounded"></div>,
});

// Import Quill styles
import "react-quill/dist/quill.snow.css";

function RecruitmentViewPage() {
  const { user } = useAuth();
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

  // Enhanced print styles with professional layout
  useEffect(() => {
    // Replace the print footer CSS section in your useEffect with this updated version:

    const printStyles = `
  <style id="print-styles">
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      @page {
        margin: 0.75in;
        size: A4;
      }
      
      body { 
        font-family: 'Arial', sans-serif !important;
        font-size: 11px !important;
        line-height: 1.4 !important;
        color: #000 !important;
        background: white !important;
      }
      
      .no-print { display: none !important; }
      .print-only { display: block !important; }
      .print-break { page-break-before: always !important; }
      .print-avoid-break { page-break-inside: avoid !important; }
      
      /* Header Styling */
      .print-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
        border-bottom: 3px solid #2563eb !important;
        padding-bottom: 15px !important;
        margin-bottom: 25px !important;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
        padding: 20px !important;
        border-radius: 8px !important;
        position: relative !important;
      }
      
      .print-company-logo {
        position: absolute !important;
        top: 10px !important;
        left: 20px !important;
        width: 80px !important;
        height: 80px !important;
        opacity: 0.9 !important;
      }
      
      .print-header-content {
        margin-left: 100px !important;
        flex: 1 !important;
      }
      
      .print-header-left h1 {
        font-size: 24px !important;
        font-weight: bold !important;
        color: #1e40af !important;
        margin: 0 0 5px 0 !important;
      }
      
      .print-header-left p {
        font-size: 12px !important;
        color: #64748b !important;
        margin: 0 !important;
      }
      
      .print-photo-container {
        width: 120px !important;
        height: 120px !important;
        border: 3px solid #2563eb !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
      }
      
      .print-photo {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      
      /* Status Badge */
      .print-status {
        background: #dcfce7 !important;
        color: #166534 !important;
        padding: 6px 12px !important;
        border-radius: 20px !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        border: 1px solid #bbf7d0 !important;
        display: inline-block !important;
        margin-top: 10px !important;
      }
      
      /* Section Styling */
      .print-section {
        background: white !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        padding: 20px !important;
        margin-bottom: 20px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        page-break-inside: avoid !important;
      }
      
      .print-section-title {
        font-size: 16px !important;
        font-weight: bold !important;
        color: #1e40af !important;
        margin: 0 0 15px 0 !important;
        padding-bottom: 8px !important;
        border-bottom: 2px solid #3b82f6 !important;
        display: flex !important;
        align-items: center !important;
      }
      
      .print-section-title::before {
        content: "📋" !important;
        margin-right: 8px !important;
        font-size: 14px !important;
      }
      
      /* Grid Layout */
      .print-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 15px !important;
      }
      
      .print-grid-3 {
        display: grid !important;
        grid-template-columns: 1fr 1fr 1fr !important;
        gap: 12px !important;
      }
      
      .print-grid-full {
        grid-column: 1 / -1 !important;
      }
      
      /* Field Styling */
      .print-field {
        margin-bottom: 12px !important;
      }
      
      .print-label {
        font-size: 10px !important;
        font-weight: 600 !important;
        color: #475569 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        margin-bottom: 3px !important;
        display: block !important;
      }
      
      .print-value {
        font-size: 12px !important;
        color: #1e293b !important;
        font-weight: 500 !important;
        padding: 6px 10px !important;
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 4px !important;
        margin: 0 !important;
      }

      /* Rich text content styling for print */
      .print-rich-text {
        font-size: 11px !important;
        color: #1e293b !important;
        padding: 8px 10px !important;
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 4px !important;
        margin: 0 !important;
        line-height: 1.5 !important;
      }

      .print-rich-text p {
        margin: 0 0 8px 0 !important;
        font-size: 11px !important;
      }

      .print-rich-text ul, .print-rich-text ol {
        margin: 4px 0 8px 20px !important;
        padding: 0 !important;
      }

      .print-rich-text li {
        margin: 2px 0 !important;
        font-size: 11px !important;
      }

      .print-rich-text strong {
        font-weight: 600 !important;
      }

      .print-rich-text em {
        font-style: italic !important;
      }

      /* Hide Quill editor toolbar and make content read-only for print */
      .ql-toolbar {
        display: none !important;
      }

      .ql-container {
        border: none !important;
        font-size: 11px !important;
      }

      .ql-editor {
        padding: 8px 10px !important;
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 4px !important;
        font-size: 11px !important;
        line-height: 1.5 !important;
      }
      
      /* Certificates */
      .print-certificates {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        margin-top: 10px !important;
      }
      
      .print-cert-item {
        background: #dbeafe !important;
        color: #1e40af !important;
        padding: 4px 10px !important;
        border-radius: 12px !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        border: 1px solid #3b82f6 !important;
      }
      
      /* Updated Footer - appears directly after content, not as page footer */
      .print-footer {
  margin-top: 40px !important;
  padding: 20px !important;
  border-top: 2px solid #e2e8f0 !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  background: #f8fafc !important;
  text-align: center !important;
  font-size: 10px !important;
  color: #64748b !important;
  page-break-inside: avoid !important;
  clear: both !important;
  /* Ensure footer appears after all content */
  position: relative !important;
  z-index: 1 !important;
}
      
      .print-footer-content {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        margin-bottom: 10px !important;
        page-break-inside: avoid !important;
      }
      
      .print-footer-logo {
        width: 50px !important;
        height: 50px !important;
        margin-right: 12px !important;
        opacity: 0.7 !important;
      }
      
      .print-footer-text {
        text-align: left !important;
      }
      
      .print-footer-title {
        font-weight: bold !important;
        margin: 0 !important;
        font-size: 11px !important;
        color: #374151 !important;
      }
      
      .print-footer-date {
        margin: 0 !important;
        font-size: 9px !important;
        color: #6b7280 !important;
      }
      
      .print-footer-copyright {
        margin: 5px 0 0 0 !important;
        font-size: 9px !important;
        text-align: center !important;
        color: #9ca3af !important;
      }
      
      /* Document Sections */
      .print-document-section {
        page-break-before: always !important;
        margin-top: 30px !important;
      }
      
      .print-document-title {
        font-size: 18px !important;
        font-weight: bold !important;
        color: #1e40af !important;
        text-align: center !important;
        margin-bottom: 20px !important;
        padding: 15px !important;
        background: #f1f5f9 !important;
        border: 2px solid #3b82f6 !important;
        border-radius: 8px !important;
      }
      
      .print-document {
        width: 100% !important;
        height: 700px !important;
        border: 2px solid #e2e8f0 !important;
        border-radius: 8px !important;
        margin: 15px 0 !important;
      }
      
      .print-document-image {
        width: 100% !important;
        max-height: 700px !important;
        object-fit: contain !important;
        border: 2px solid #e2e8f0 !important;
        border-radius: 8px !important;
        margin: 15px 0 !important;
      }
      
      /* Special styling for personal info section */
      .print-personal-info .print-section-title::before {
        content: "👤" !important;
      }
      
      .print-physical-info .print-section-title::before {
        content: "📏" !important;
      }
      
      .print-education-info .print-section-title::before {
        content: "🎓" !important;
      }
      
      .print-certificates-section {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  margin-bottom: 30px !important;
  min-height: 80px !important;
  /* Ensure enough space for certificates */
  overflow: visible !important;
  position: relative !important;
}

.print-certificates-section .print-section-title::before {
  content: "🏆" !important;
}

/* Certificates container */
.print-certificates {
  display: block !important;
  margin-top: 15px !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  min-height: 40px !important;
  padding-bottom: 10px !important;
  /* Use CSS Grid for better control */
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
  gap: 8px !important;
  align-items: start !important;
}

/* Individual certificate items */
.print-cert-item {
  background: #dbeafe !important;
  color: #1e40af !important;
  padding: 6px 12px !important;
  border-radius: 15px !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  border: 1px solid #3b82f6 !important;
  text-align: center !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  line-height: 1.2 !important;
  height: auto !important;
  min-height: 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
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

  // PDF Download function using browser's print to PDF
  const downloadAsPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent =
      document.querySelector(".print-container")?.innerHTML || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recruitmentForm?.fullName} - Recruitment Form</title>
          <style>
            ${document.getElementById("print-styles")?.innerHTML || ""}
            body { margin: 0; padding: 20px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
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
      <div className="max-w-6xl mx-auto space-y-6 print-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print-header">
          {/* Company Logo - Print Only */}
          <img
            src="/logohr.svg"
            alt="Company Logo"
            className="print-company-logo hidden print:block"
          />

          <div className="print-header-content">
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
            {/* Status for print */}
            <div className="hidden print:block print-status">
              Status: {recruitmentForm.status.replace("_", " ")}
            </div>
          </div>

          {/* Photo in print mode */}
          {recruitmentForm.documentPhotoUrl && (
            <div className="hidden print:block print-photo-container">
              <img
                src={recruitmentForm.documentPhotoUrl}
                alt={`${recruitmentForm.fullName}'s photo`}
                className="print-photo"
              />
            </div>
          )}

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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section print-personal-info">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-section-title">
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
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 print-label">
                    Marital Status
                  </label>
                  <p className="text-gray-900 dark:text-white print-value">
                    {recruitmentForm.maritalStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Physical & Size Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section print-physical-info">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-section-title">
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
            {/* BMI Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-section-title flex items-center">
                <span className="mr-2">⚖️</span>
                Body Mass Index (BMI)
              </h2>
              {(() => {
                const bmi = calculateBMI(
                  recruitmentForm.heightCm,
                  recruitmentForm.weightKg
                );
                const bmiInfo = getBMICategory(bmi);
                const bmiStatus = getBMIStatus(bmi);

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print-grid-3">
                    {/* BMI Value */}
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {bmi}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        BMI Value
                      </div>
                    </div>

                    {/* BMI Category */}
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${bmiInfo.color}`}
                      >
                        {bmiInfo.category}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Category
                      </div>
                    </div>

                    {/* BMI Status */}
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {bmiStatus}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Health Status
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* BMI Reference Chart */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  BMI Reference Chart
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      &lt; 18.5 Underweight
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      18.5-24.9 Normal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      25.0-29.9 Overweight
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      ≥ 30.0 Obese
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section print-education-info">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-section-title">
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
                  <div className="md:col-span-2 print-grid-full">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 print-label">
                      Work Experience
                    </label>
                    {/* React Quill for displaying rich text - screen view with custom styling */}
                    <div className="no-print work-experience-container">
                      <ReactQuill
                        value={recruitmentForm.workExperience}
                        readOnly={true}
                        theme="snow"
                        modules={{
                          toolbar: false,
                        }}
                        style={{
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    {/* Print version - plain HTML rendering */}
                    <div
                      className="hidden print:block print-rich-text"
                      dangerouslySetInnerHTML={{
                        __html: recruitmentForm.workExperience,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 print-section print-certificates-section">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-section-title">
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
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  Print Details
                </button>
                <button
                  onClick={downloadAsPDF}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download as PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block print-footer">
          <div className="print-footer-content">
            <img
              src="/logohr.svg"
              alt="Company Logo"
              className="print-footer-logo"
            />
            <div className="print-footer-text">
              <p className="print-footer-title">HR Recruitment System</p>
              <p className="print-footer-date">
                Generated on{" "}
                {new Date().toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <p className="print-footer-copyright">
            © 2024 Recruitment Management System - Confidential Document
          </p>
        </div>

        {/* Documents summary for print only - REMOVED */}
      </div>

      {/* Photo Modal */}
      <PhotoModal />

      {/* Document Modal */}
      <DocumentModal />
    </>
  );
}

export default withAuthGuard(RecruitmentViewPage);
