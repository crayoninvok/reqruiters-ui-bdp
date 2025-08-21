import React from "react";

export const PrintFooter: React.FC = () => {
  return (
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
  );
};
