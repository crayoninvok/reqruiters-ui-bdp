import React, { useEffect } from "react";

export const PrintStyles: React.FC = () => {
  useEffect(() => {
    const printStyles = `
  <style id="print-styles">
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      @page {
        margin: 0.75in !important;
        size: A4 !important;
      }
      
      body { 
        font-family: 'Arial', sans-serif !important;
        font-size: 11px !important;
        line-height: 1.4 !important;
        color: #000 !important;
        background: white !important;
        padding-bottom: 0 !important;
        margin: 0 !important;
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
        padding: 20px !important;
        margin-bottom: 25px !important;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
        border-radius: 8px !important;
        position: relative !important;
        page-break-inside: avoid !important;
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
        break-inside: avoid !important;
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
        page-break-inside: avoid !important;
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
      
      /* FIXED: Certificates Section - Main fixes here */
      .print-certificates-section {
        background: white !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        padding: 20px !important;
        margin-bottom: 40px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        /* CRITICAL: Force section to stay together */
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        /* Ensure enough space at bottom of page */
        margin-bottom: 100px !important;
        /* Add space before if close to page end */
        page-break-before: auto !important;
        /* Prevent orphaned content */
        orphans: 2 !important;
        widows: 2 !important;
      }

      .print-certificates-section .print-section-title::before {
        content: "🏆" !important;
      }
      
      /* FIXED: Certificates Container */
      .print-certificates {
        display: block !important;
        margin-top: 15px !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        overflow: visible !important;
      }
      
      /* FIXED: Individual Certificate Items */
      .print-cert-item {
        background: #dbeafe !important;
        color: #1e40af !important;
        padding: 4px 8px !important;
        border-radius: 12px !important;
        font-size: 9px !important;
        font-weight: 600 !important;
        border: 1px solid #3b82f6 !important;
        display: inline-block !important;
        margin: 2px 4px 2px 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: 140px !important;
        vertical-align: top !important;
        line-height: 1.2 !important;
        /* Prevent individual items from breaking */
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* FIXED: Footer Styling */
      .print-footer {
        margin-top: 40px !important;
        padding: 15px !important;
        border-top: 2px solid #e2e8f0 !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        background: #f8fafc !important;
        text-align: center !important;
        font-size: 10px !important;
        color: #64748b !important;
        /* Ensure footer doesn't break */
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        clear: both !important;
        position: relative !important;
        /* Ensure enough space before footer */
        margin-top: 60px !important;
      }
      
      .print-footer-content {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        margin-bottom: 8px !important;
        page-break-inside: avoid !important;
      }
      
      .print-footer-logo {
        width: 40px !important;
        height: 40px !important;
        margin-right: 10px !important;
        opacity: 0.7 !important;
      }
      
      .print-footer-text {
        text-align: left !important;
      }
      
      .print-footer-title {
        font-weight: bold !important;
        margin: 0 !important;
        font-size: 10px !important;
        color: #374151 !important;
      }
      
      .print-footer-date {
        margin: 0 !important;
        font-size: 8px !important;
        color: #6b7280 !important;
      }
      
      .print-footer-copyright {
        margin: 3px 0 0 0 !important;
        font-size: 8px !important;
        text-align: center !important;
        color: #9ca3af !important;
      }
      
      /* Container adjustments - Remove conflicting bottom padding */
      .print-container {
        position: relative !important;
        padding-bottom: 0 !important;
        min-height: auto !important;
        /* Add space for fixed footer */
        margin-bottom: 100px !important;
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
      
      /* Special styling for specific sections */
      .print-personal-info .print-section-title::before {
        content: "👤" !important;
      }
      
      .print-physical-info .print-section-title::before {
        content: "📏" !important;
      }
      
      .print-education-info .print-section-title::before {
        content: "🎓" !important;
      }

      /* BMI Section */
      .print-bmi-section .print-section-title::before {
        content: "⚖️" !important;
      }

      /* Table styling for better document structure */
      .print-table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-top: 10px !important;
        page-break-inside: auto !important;
      }

      .print-table th,
      .print-table td {
        border: 1px solid #e2e8f0 !important;
        padding: 8px 12px !important;
        text-align: left !important;
        font-size: 11px !important;
        line-height: 1.4 !important;
      }

      .print-table th {
        background: #f8fafc !important;
        font-weight: 600 !important;
        color: #374151 !important;
      }

      .print-table td {
        color: #1e293b !important;
      }

      /* Force page break utility classes */
      .print-force-new-page {
        page-break-before: always !important;
      }
      
      .print-keep-together {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Responsive print adjustments */
      @media print and (max-width: 8.5in) {
        .print-grid {
          grid-template-columns: 1fr !important;
          gap: 10px !important;
        }
        
        .print-grid-3 {
          grid-template-columns: 1fr 1fr !important;
          gap: 10px !important;
        }
        
        .print-header {
          padding: 15px !important;
        }
        
        .print-section {
          padding: 15px !important;
        }

        .print-certificates {
          gap: 4px !important;
        }
        
        .print-cert-item {
          font-size: 8px !important;
          padding: 3px 6px !important;
          max-width: 120px !important;
        }
        
        .print-footer {
          padding: 10px !important;
        }
        
        .print-certificates-section {
          margin-bottom: 80px !important;
        }
      }

      /* Enhanced readability */
      .print-highlight {
        background: #fef3c7 !important;
        padding: 2px 4px !important;
        border-radius: 3px !important;
      }

      .print-important {
        font-weight: 600 !important;
        color: #dc2626 !important;
      }

      .print-success {
        color: #059669 !important;
        font-weight: 600 !important;
      }

      .print-warning {
        color: #d97706 !important;
        font-weight: 600 !important;
      }

      /* Additional fixes for specific sections */
      .print-certificates-section:last-of-type {
        margin-bottom: 120px !important;
      }
      
      /* Ensure last section before footer has enough space */
      .print-container > div:last-child {
        margin-bottom: 120px !important;
      }
    }
  </style>
`;

    // Remove existing styles if present
    const existingStyles = document.getElementById("print-styles");
    if (existingStyles) {
      existingStyles.remove();
    }

    // Add new styles to head
    document.head.insertAdjacentHTML("beforeend", printStyles);

    // Cleanup function
    return () => {
      const styles = document.getElementById("print-styles");
      if (styles) {
        styles.remove();
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};