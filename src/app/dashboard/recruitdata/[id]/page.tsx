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
import { PrintStyles } from "@/components/recruitdata-id/PrintStyles";

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
      <PrintStyles />
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
          <SidebarSection
            recruitmentForm={recruitmentForm}
            onPhotoClick={() => setShowPhotoModal(true)}
            onViewDocument={viewDocument}
            onDownloadDocument={downloadDocument}
            onPrint={() => window.print()}
            onDownloadPDF={downloadAsPDF}
            getFileType={getFileType}
          />
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
