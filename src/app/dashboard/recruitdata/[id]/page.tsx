"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RecruitmentFormService } from "@/services/recruitment.service";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";
import Swal from "sweetalert2";
import { useAuth } from "@/context/useAuth";
import { withAuthGuard } from "@/components/withGuard";

// Import components
import { RecruitmentHeader } from "@/components/recruitdata-id/RecruitmentHeader";
import { PersonalInfoSection } from "@/components/recruitdata-id/PersonalSection";
import { PhysicalInfoSection } from "@/components/recruitdata-id/PhysicallInfoSection";
import { BMISection } from "@/components/recruitdata-id/BMISection";
import { EducationSection } from "@/components/recruitdata-id/EducationSection";
import { CertificatesSection } from "@/components/recruitdata-id/CertificateSection";
import { SidebarSection } from "@/components/recruitdata-id/SidebarSection";
import { PhotoModal } from "@/components/recruitdata-id/PhotoModal";
import { DocumentModal } from "@/components/recruitdata-id/DocumentModal";
import { PrintFooter } from "@/components/recruitdata-id/PrintFooter";
import { RecruitmentPrintComponent } from '@/components/recruitdata-id/RecruitmentPrint';

function RecruitmentViewPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const [recruitmentForm, setRecruitmentForm] = useState<RecruitmentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);

  const id = params.id as string;

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
        background: "#1f2937",
        color: "#f9fafb",
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
        background: "#1f2937",
        color: "#f9fafb",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
    }
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
          <p class="text-gray-300 mb-4">Click the button below to download the document:</p>
          <a href="${convertToPublicUrl(url)}" target="_blank" 
             class="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-decoration-none rounded-md transition-colors">
            Download ${filename}
          </a>
        `,
        icon: "info",
        showConfirmButton: true,
        confirmButtonText: "Close",
        confirmButtonColor: "#3b82f6",
        background: "#1f2937",
        color: "#f9fafb",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600/30 border-t-blue-400"></div>
          <p className="text-gray-300 text-sm">Loading recruitment data...</p>
        </div>
      </div>
    );
  }

  if (!recruitmentForm) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-8 max-w-md mx-auto">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Recruitment Form Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The requested recruitment form could not be found.
          </p>
          <button
            onClick={() => router.push("/dashboard/recruitdata")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Back to Recruitment Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6 print-container">
        <RecruitmentHeader
          recruitmentForm={recruitmentForm}
          onStatusUpdate={handleStatusUpdate}
          router={router}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoSection recruitmentForm={recruitmentForm} />
            <PhysicalInfoSection recruitmentForm={recruitmentForm} />
            <BMISection recruitmentForm={recruitmentForm} />
            <EducationSection recruitmentForm={recruitmentForm} />
            <CertificatesSection recruitmentForm={recruitmentForm} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidate Photo */}
            {recruitmentForm.documentPhotoUrl && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6 no-print">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Candidate Photo
                </h3>
                <div className="flex justify-center">
                  <div
                    className="w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-600/50 cursor-pointer hover:opacity-90 hover:border-gray-500/70 transition-all duration-200"
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
                    className="block w-full text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
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
                    className="block w-full text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
                  >
                    Download Photo
                  </button>
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6 no-print">
              <h3 className="text-lg font-semibold text-white mb-4">
                Documents
              </h3>
              <div className="space-y-3">
                {recruitmentForm.documentCvUrl && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-300">CV</span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.documentCvUrl!,
                            "CV",
                            getFileType(recruitmentForm.documentCvUrl!)
                          )
                        }
                        className="text-green-400 hover:text-green-300 text-sm transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadDocument(recruitmentForm.documentCvUrl!, "cv.pdf")
                        }
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
                {recruitmentForm.documentKtpUrl && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-300">KTP</span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.documentKtpUrl!,
                            "KTP",
                            getFileType(recruitmentForm.documentKtpUrl!)
                          )
                        }
                        className="text-green-400 hover:text-green-300 text-sm transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadDocument(recruitmentForm.documentKtpUrl!, "ktp.jpg")
                        }
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
                {recruitmentForm.documentSkckUrl && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-300">SKCK</span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.documentSkckUrl!,
                            "SKCK",
                            getFileType(recruitmentForm.documentSkckUrl!)
                          )
                        }
                        className="text-green-400 hover:text-green-300 text-sm transition-colors"
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
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
                {recruitmentForm.documentVaccineUrl && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-300">Vaccine Certificate</span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.documentVaccineUrl!,
                            "Vaccine Certificate",
                            getFileType(recruitmentForm.documentVaccineUrl!)
                          )
                        }
                        className="text-green-400 hover:text-green-300 text-sm transition-colors"
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
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
                {recruitmentForm.supportingDocsUrl && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-300">Supporting Docs</span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() =>
                          viewDocument(
                            recruitmentForm.supportingDocsUrl!,
                            "Supporting Documents",
                            getFileType(recruitmentForm.supportingDocsUrl!)
                          )
                        }
                        className="text-green-400 hover:text-green-300 text-sm transition-colors"
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
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Print Component - Replace the old print section */}
            <RecruitmentPrintComponent recruitmentForm={recruitmentForm} />
          </div>
        </div>

        <PrintFooter />
      </div>

      <PhotoModal
        show={showPhotoModal}
        recruitmentForm={recruitmentForm}
        onClose={() => setShowPhotoModal(false)}
        onDownload={downloadDocument}
      />

      <DocumentModal
        show={showDocumentModal}
        document={currentDocument}
        onClose={() => setShowDocumentModal(false)}
        onDownload={downloadDocument}
      />
    </>
  );
}

export default withAuthGuard(RecruitmentViewPage);