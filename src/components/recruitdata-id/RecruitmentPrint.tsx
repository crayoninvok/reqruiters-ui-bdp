import React, { useState } from "react";
import { RecruitmentForm } from "@/types/types";

interface RecruitmentPrintComponentProps {
  recruitmentForm: RecruitmentForm;
  onClose?: () => void;
}

export const RecruitmentPrintComponent: React.FC<
  RecruitmentPrintComponentProps
> = ({ recruitmentForm, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "ON_PROGRESS":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "HIRED":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const toast = document.createElement("div");
    const bgColor =
      type === "success" ? "#10b981" : type === "error" ? "#dc2626" : "#3b82f6";

    toast.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: ${bgColor}; 
        color: white; 
        padding: 12px 20px; 
        border-radius: 8px; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.2); 
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      ">
        ${message}
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const handlePrint = () => {
    setIsLoading(true);

    // Create print window with optimized content
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      showToast("Failed to open print window. Please allow popups.", "error");
      setIsLoading(false);
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${recruitmentForm.fullName} - Recruitment Form</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            
            .print-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .header-left {
              flex: 1;
            }
            
            .company-info {
              margin-bottom: 15px;
            }
            
            .company-logo {
              width: 120px;
              height: auto;
              margin-bottom: 10px;
            }
            
            .company-name {
              font-size: 18px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 5px;
            }
            
            .document-title {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 10px;
            }
            
            .candidate-name {
              font-size: 20px;
              color: #2563eb;
              font-weight: 600;
            }
            
            .header-right {
              text-align: center;
              min-width: 150px;
            }
            
            .candidate-photo {
              width: 120px;
              height: 150px;
              object-fit: cover;
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              margin-bottom: 10px;
            }
            
            .print-date {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 5px;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 500;
              text-transform: uppercase;
            }
            
            .content-section {
              margin-bottom: 25px;
              background: #f9fafb;
              border-radius: 8px;
              padding: 20px;
              border: 1px solid #e5e7eb;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid #2563eb;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 15px;
            }
            
            .info-item {
              display: flex;
              flex-direction: column;
            }
            
            .info-label {
              font-weight: 600;
              color: #374151;
              font-size: 14px;
              margin-bottom: 5px;
            }
            
            .info-value {
              color: #1f2937;
              font-size: 14px;
              padding: 8px 12px;
              background: white;
              border-radius: 4px;
              border: 1px solid #d1d5db;
              min-height: 32px;
              display: flex;
              align-items: center;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
            
            .signature-area {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              margin-bottom: 20px;
            }
            
            .signature-box {
              text-align: center;
              width: 200px;
            }
            
            .signature-line {
              border-top: 1px solid #000;
              margin: 60px 0 10px 0;
            }
            
            @page {
              size: A4;
              margin: 1.5cm;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              .print-container {
                box-shadow: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Header -->
            <div class="header">
              <div class="header-left">
                <div class="company-info">
                  <img src="/logohr.svg" alt="Company Logo" class="company-logo" onerror="this.style.display='none'">
                  <div class="company-name">PT. Batara Dharma Persada</div>
                </div>
                <div class="document-title">RECRUITMENT FORM</div>
                <div class="candidate-name">${recruitmentForm.fullName}</div>
              </div>
              <div class="header-right">
                ${
                  recruitmentForm.documentPhotoUrl
                    ? `
                  <img src="${recruitmentForm.documentPhotoUrl}" 
                       alt="Candidate Photo" 
                       class="candidate-photo"
                       onerror="this.style.display='none'">
                `
                    : ""
                }
                <div class="print-date">Printed: ${formatDate(
                  new Date().toISOString()
                )}</div>
                <div class="status-badge ${getStatusColor(
                  recruitmentForm.status
                )}">
                  ${recruitmentForm.status.replace("_", " ")}
                </div>
              </div>
            </div>
            
            <!-- Personal Information -->
            <div class="content-section">
              <div class="section-title">Personal Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Full Name</div>
                  <div class="info-value">${recruitmentForm.fullName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Place of Birth</div>
                  <div class="info-value">${recruitmentForm.birthPlace}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Date of Birth</div>
                  <div class="info-value">${new Date(
                    recruitmentForm.birthDate
                  ).toLocaleDateString("id-ID")}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Gender</div>
                  <div class="info-value">${recruitmentForm.gender}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Religion</div>
                  <div class="info-value">${recruitmentForm.religion}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Marital Status</div>
                  <div class="info-value">${recruitmentForm.maritalStatus}</div>
                </div>
              </div>
            </div>
            
            <!-- Contact Information -->
            <div class="content-section">
              <div class="section-title">Contact Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">${
                    recruitmentForm.whatsappNumber
                  }</div>
                </div>
                <div class="info-item">
                  <div class="info-label">WhatsApp Number</div>
                  <div class="info-value">${
                    recruitmentForm.whatsappNumber
                  }</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Created At</div>
                  <div class="info-value">${recruitmentForm.createdAt}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Address</div>
                  <div class="info-value">${recruitmentForm.address}</div>
                </div>
              </div>
            </div>
            
            <!-- Physical Information -->
            <div class="content-section">
              <div class="section-title">Physical Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Height (cm)</div>
                  <div class="info-value">${recruitmentForm.heightCm}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Weight (kg)</div>
                  <div class="info-value">${recruitmentForm.weightKg}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">BMI</div>
                  <div class="info-value">${(
                    recruitmentForm.weightKg /
                    Math.pow(recruitmentForm.heightCm / 100, 2)
                  ).toFixed(1)}</div>
                </div>
              </div>
            </div>
            
            <!-- Education -->
            <div class="content-section">
              <div class="section-title">Education</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Education</div>
                  <div class="info-value">${recruitmentForm.education}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">School Name</div>
                  <div class="info-value">${recruitmentForm.schoolName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Major</div>
                  <div class="info-value">${
                    recruitmentForm.jurusan || "-"
                  }</div>
                </div>
              </div>
            </div>
            
           <!-- Certificates -->
${
  recruitmentForm.certificate && recruitmentForm.certificate.length > 0
    ? `
<div class="content-section">
  <div class="section-title">Certificates</div>
  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
    ${recruitmentForm.certificate
      .map(
        (cert) => `
      <div style="
        padding: 8px 16px;
        background: #f0f9ff;
        color: #0369a1;
        border: 1px solid #0ea5e9;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
      ">
        ${cert.replace(/_/g, " ")}
      </div>
    `
      )
      .join("")}
  </div>
</div>
`
    : ""
}


            <!-- Application Info -->
            <div class="content-section">
              <div class="section-title">Application Information</div>
              <div class="info-grid">
              <div class="info-item">
                  <div class="info-label">Applied Position</div>
                  <div class="info-value">${recruitmentForm.appliedPosition?.replace(
                    "_",
                    " "
                  )}</div>
                <div class="info-item">
                  <div class="info-label">Applied Date</div>
                  <div class="info-value">${formatDate(
                    recruitmentForm.createdAt
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Last Updated</div>
                  <div class="info-value">${formatDate(
                    recruitmentForm.updatedAt
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Current Status</div>
                  <div class="info-value">${recruitmentForm.status.replace(
                    "_",
                    " "
                  )}</div>
                </div>
              </div>
            </div>
            
            <!-- Signature Area -->
            <div class="signature-area">
              <div class="signature-box">
                <div>HR Manager</div>
                <div class="signature-line"></div>
                <div>(_________________)</div>
              </div>
              <div class="signature-box">
                <div>Candidate</div>
                <div class="signature-line"></div>
                <div>${recruitmentForm.fullName}</div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p>This document is generated automatically from the recruitment system.</p>
              <p>For verification, please contact HR department.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();

        // Close print window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
          setIsLoading(false);
          showToast("Document sent to printer successfully!", "success");
          onClose?.();
        };

        // Fallback for browsers that don't support onafterprint
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
          }
          setIsLoading(false);
          showToast("Print dialog opened successfully!", "success");
          onClose?.();
        }, 2000);
      }, 500);
    };

    // Fallback in case onload doesn't fire
    setTimeout(() => {
      if (!printWindow.closed && !isLoading) {
        printWindow.focus();
        printWindow.print();
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    showToast("Generating PDF, please wait...", "info");

    try {
      // Dynamic import of required libraries
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Create a temporary container for PDF generation
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "794px"; // A4 width
      tempDiv.style.backgroundColor = "white";
      tempDiv.style.padding = "40px";

      // Insert the same HTML content as print
      tempDiv.innerHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
          <!-- PDF content here - similar structure to print but optimized for PDF -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">RECRUITMENT FORM</div>
              <div style="font-size: 20px; color: #2563eb; font-weight: 600;">${
                recruitmentForm.fullName
              }</div>
            </div>
            ${
              recruitmentForm.documentPhotoUrl
                ? `
              <img src="${recruitmentForm.documentPhotoUrl}" 
                   style="width: 120px; height: 150px; object-fit: cover; border: 2px solid #e5e7eb; border-radius: 8px;"
                   onerror="this.style.display='none'">
            `
                : ""
            }
          </div>
          
          <!-- Personal Information -->
          <div style="margin-bottom: 25px; background: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <div style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #2563eb;">Personal Information</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
              <div><strong>Full Name:</strong> ${recruitmentForm.fullName}</div>
              <div><strong>Place of Birth:</strong> ${
                recruitmentForm.birthPlace
              }</div>
              <div><strong>Date of Birth:</strong> ${new Date(
                recruitmentForm.birthDate
              ).toLocaleDateString("id-ID")}</div>
              <div><strong>Gender:</strong> ${recruitmentForm.gender}</div>
              <div><strong>Religion:</strong> ${recruitmentForm.religion}</div>
              <div><strong>Marital Status:</strong> ${
                recruitmentForm.maritalStatus
              }</div>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="margin-bottom: 25px; background: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <div style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #2563eb;">Contact Information</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
              <div><strong>Phone:</strong> ${
                recruitmentForm.whatsappNumber
              }</div>
              <div><strong>WhatsApp:</strong> ${
                recruitmentForm.whatsappNumber
              }</div>
              <div><strong>Address:</strong> ${recruitmentForm.address}</div>
            </div>
          </div>
          
          <!-- Physical Information -->
          <div style="margin-bottom: 25px; background: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <div style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #2563eb;">Physical Information</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
              <div><strong>Height:</strong> ${recruitmentForm.heightCm} cm</div>
              <div><strong>Weight:</strong> ${recruitmentForm.weightKg} kg</div>
              <div><strong>BMI:</strong> ${(
                recruitmentForm.weightKg /
                Math.pow(recruitmentForm.heightCm / 100, 2)
              ).toFixed(1)}</div>
            </div>
          </div>
          
          <!-- Education -->
          <div style="margin-bottom: 25px; background: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <div style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #2563eb;">Education</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
              <div><strong>Last Education:</strong> ${
                recruitmentForm.education
              }</div>
              <div><strong>School Name:</strong> ${
                recruitmentForm.schoolName
              }</div>
              <div><strong>Major:</strong> ${
                recruitmentForm.jurusan || "-"
              }</div>
            </div>
          </div>
          
          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280;">
            Generated on ${formatDate(
              new Date().toISOString()
            )} | Status: ${recruitmentForm.status.replace("_", " ")}
          </div>
        </div>
      `;

      document.body.appendChild(tempDiv);

      // Generate canvas from HTML
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

      // Save PDF
      const fileName = `${recruitmentForm.fullName.replace(
        /\s+/g,
        "_"
      )}_recruitment_form.pdf`;
      pdf.save(fileName);

      // Clean up
      document.body.removeChild(tempDiv);

      showToast("PDF downloaded successfully!", "success");
      onClose?.();
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Error generating PDF. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-400"
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
          Print & Export
        </h3>
        {showPreview && (
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
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
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
              Generating PDF...
            </>
          ) : (
            <>
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
            </>
          )}
        </button>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {showPreview && (
        <div className="mt-6 border-t border-gray-600 pt-6">
          <div className="bg-white rounded-lg p-4 shadow-inner max-h-96 overflow-y-auto">
            <div className="text-black text-sm space-y-4">
              <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-blue-600">
                    RECRUITMENT FORM
                  </h2>
                  <p className="text-lg font-semibold">
                    {recruitmentForm.fullName}
                  </p>
                </div>
                {recruitmentForm.documentPhotoUrl && (
                  <img
                    src={recruitmentForm.documentPhotoUrl}
                    alt="Preview"
                    className="w-16 h-20 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <strong>Full Name:</strong> {recruitmentForm.fullName}
                  </div>
                  <div>
                    <strong>Gender:</strong> {recruitmentForm.gender}
                  </div>
                  <div>
                    <strong>Birth:</strong> {recruitmentForm.birthPlace},{" "}
                    {new Date(recruitmentForm.birthDate).toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                  <div>
                    <strong>Religion:</strong> {recruitmentForm.religion}
                  </div>
                  <div>
                    <strong>Marital:</strong> {recruitmentForm.maritalStatus}
                  </div>
                  <div>
                    <strong>Phone:</strong> {recruitmentForm.whatsappNumber}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">
                  Physical & Education
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <strong>Height/Weight:</strong> {recruitmentForm.heightCm}cm
                    / {recruitmentForm.weightKg}kg
                  </div>
                  <div>
                    <strong>BMI:</strong>{" "}
                    {(
                      recruitmentForm.weightKg /
                      Math.pow(recruitmentForm.heightCm / 100, 2)
                    ).toFixed(1)}
                  </div>
                  <div>
                    <strong>Education:</strong> {recruitmentForm.education}
                  </div>
                  <div>
                    <strong>School:</strong> {recruitmentForm.schoolName}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Applied: {formatDate(recruitmentForm.createdAt)}
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    recruitmentForm.status
                  )}`}
                >
                  {recruitmentForm.status.replace("_", " ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex items-start space-x-2 text-xs text-gray-400">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p>
              <strong>Print:</strong> Opens system print dialog with optimized
              formatting
            </p>
            <p>
              <strong>PDF:</strong> Downloads a professional PDF document
            </p>
            <p>
              <strong>Preview:</strong> Shows how the document will look when
              printed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
