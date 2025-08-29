import React from "react";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";

interface SidebarSectionProps {
  recruitmentForm: RecruitmentForm;
  onPhotoClick: () => void;
  onViewDocument: (url: string, name: string, type: "image" | "pdf") => void;
  onDownloadDocument: (url: string, filename: string) => void;
  getFileType: (url: string) => "image" | "pdf";
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  recruitmentForm,
  onPhotoClick,
  onViewDocument,
  onDownloadDocument,
  getFileType,
}) => {
  const getStatusColor = (status: RecruitmentStatus) => {
    switch (status) {
      case RecruitmentStatus.PENDING:
        return "bg-yellow-900/30 text-yellow-300 border-yellow-400/20";
      case RecruitmentStatus.ON_PROGRESS:
        return "bg-blue-900/30 text-blue-300 border-blue-400/20";
      case RecruitmentStatus.HIRED:
        return "bg-green-900/30 text-green-300 border-green-400/20";
      default:
        return "bg-gray-700/50 text-gray-300 border-gray-600/30";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Print function integrated directly
  const handlePrint = () => {
    // Use the existing print-container content
    const element = document.querySelector('.print-container') as HTMLElement;
    
    if (!element) {
      console.error('Print container not found');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    // Get all stylesheets from the current page
    const stylesheets = Array.from(document.styleSheets)
      .map(stylesheet => {
        try {
          return Array.from(stylesheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          // Handle CORS errors for external stylesheets
          return '';
        }
      })
      .join('\n');

    // Create the HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recruitmentForm.fullName} - Recruitment Form</title>
          <meta charset="utf-8">
          <style>
            ${stylesheets}
            
            /* Additional print styles */
            body {
              margin: 0;
              padding: 20px;
              background: white !important;
              color: black !important;
              font-family: system-ui, -apple-system, sans-serif;
            }
            
            * {
              background: transparent !important;
              color: black !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
            
            .bg-gray-800, .bg-gray-900, .bg-slate-800 {
              background: white !important;
              border: 1px solid #e5e7eb !important;
            }
            
            .text-white, .text-gray-100, .text-gray-200, .text-gray-300 {
              color: #374151 !important;
            }
            
            .border-gray-700, .border-gray-600 {
              border-color: #d1d5db !important;
            }
            
            /* Hide elements that shouldn't print */
            .no-print,
            button,
            .btn,
            .print-hide {
              display: none !important;
            }
            
            @page {
              margin: 1cm;
              size: A4;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div style="max-width: 100%; margin: 0 auto;">
            ${element.innerHTML}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    // Fallback in case onload doesn't fire
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }, 1000);
  };

  // PDF download function integrated directly
  const handleDownloadPDF = async () => {
    // Use the existing print-container content
    const element = document.querySelector('.print-container') as HTMLElement;
    
    if (!element) {
      console.error('Print container not found');
      return;
    }

    try {
      // Show loading notification
      const loadingToast = document.createElement('div');
      loadingToast.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #1f2937; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 9999; display: flex; align-items: center; gap: 12px;">
          <div style="width: 20px; height: 20px; border: 2px solid #3b82f6; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <span>Generating PDF...</span>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      `;
      document.body.appendChild(loadingToast);

      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = element.innerHTML;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
      tempContainer.style.background = 'white';
      tempContainer.style.color = 'black';
      tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      document.body.appendChild(tempContainer);

      // Apply print styles to temp container
      const style = document.createElement('style');
      style.textContent = `
        .temp-print-container * {
          background: white !important;
          color: black !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        .temp-print-container .bg-gray-800,
        .temp-print-container .bg-gray-900,
        .temp-print-container .bg-slate-800 {
          background: white !important;
          border: 1px solid #e5e7eb !important;
        }
        .temp-print-container .text-white,
        .temp-print-container .text-gray-100,
        .temp-print-container .text-gray-200,
        .temp-print-container .text-gray-300 {
          color: #374151 !important;
        }
        .temp-print-container .border-gray-700,
        .temp-print-container .border-gray-600 {
          border-color: #d1d5db !important;
        }
        .temp-print-container .no-print,
        .temp-print-container button,
        .temp-print-container .btn {
          display: none !important;
        }
      `;
      tempContainer.className = 'temp-print-container';
      document.head.appendChild(style);

      // Import html2canvas and jsPDF dynamically
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      // Generate canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate dimensions to fit the page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      // Center the image on the page
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      
      // Save the PDF
      pdf.save(`${recruitmentForm.fullName}_recruitment_form.pdf`);
      
      // Clean up
      document.body.removeChild(tempContainer);
      document.head.removeChild(style);
      document.body.removeChild(loadingToast);

      // Show success notification
      const successToast = document.createElement('div');
      successToast.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 9999;">
          PDF downloaded successfully!
        </div>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => document.body.removeChild(successToast), 3000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Clean up on error
      const tempContainer = document.querySelector('.temp-print-container');
      const loadingToast = document.querySelector('[style*="Generating PDF"]')?.parentElement;
      if (tempContainer) document.body.removeChild(tempContainer);
      if (loadingToast) document.body.removeChild(loadingToast);

      // Show error notification
      const errorToast = document.createElement('div');
      errorToast.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #dc2626; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 9999;">
          Error generating PDF. Please try again.
        </div>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => document.body.removeChild(errorToast), 3000);
    }
  };

  return (
    <div className="space-y-6 no-print">
      {/* Candidate Photo */}
      {recruitmentForm.documentPhotoUrl && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Candidate Photo
          </h3>
          <div className="flex justify-center">
            <div
              className="w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-600/50 cursor-pointer hover:opacity-90 hover:border-gray-500/70 transition-all duration-200"
              onClick={onPhotoClick}
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
              onClick={onPhotoClick}
              className="block w-full text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
            >
              View Full Size
            </button>
            <button
              onClick={() =>
                onDownloadDocument(
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

      {/* Quick Info */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Quick Info
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getStatusColor(
                recruitmentForm.status
              )}`}
            >
              {recruitmentForm.status.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">
              Marital Status:
            </span>
            <span className="text-white">
              {recruitmentForm.maritalStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Applied:</span>
            <span className="text-white">
              {formatDate(recruitmentForm.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Updated:</span>
            <span className="text-white">
              {formatDate(recruitmentForm.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Documents
        </h3>
        <div className="space-y-3">
          {recruitmentForm.documentCvUrl && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">
                CV
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    onViewDocument(
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
                    onDownloadDocument(recruitmentForm.documentCvUrl!, "cv.pdf")
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
              <span className="text-sm text-gray-300">
                KTP
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    onViewDocument(
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
                    onDownloadDocument(recruitmentForm.documentKtpUrl!, "ktp.jpg")
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
              <span className="text-sm text-gray-300">
                SKCK
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    onViewDocument(
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
                    onDownloadDocument(
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
              <span className="text-sm text-gray-300">
                Vaccine Certificate
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    onViewDocument(
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
                    onDownloadDocument(
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
              <span className="text-sm text-gray-300">
                Supporting Docs
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    onViewDocument(
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
                    onDownloadDocument(
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

      {/* Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Actions
        </h3>
        <div className="space-y-3">
          <button
            onClick={handlePrint}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center backdrop-blur-sm"
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
            onClick={handleDownloadPDF}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center backdrop-blur-sm"
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
  );
};