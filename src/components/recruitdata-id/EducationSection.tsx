import React from "react";
import { RecruitmentForm } from "@/types/types";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-700/50 h-20 rounded"></div>,
});

// Import Quill styles
import "react-quill/dist/quill.snow.css";

interface EducationSectionProps {
  recruitmentForm: RecruitmentForm;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  recruitmentForm,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6 print-section print-education-info">
      <h2 className="text-lg font-semibold text-white mb-4 print-section-title">
        Education & Experience
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-grid">
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label">
            Education Level
          </label>
          <p className="text-white font-medium print-value">
            {recruitmentForm.education}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label">
            School Name
          </label>
          <p className="text-white print-value">
            {recruitmentForm.schoolName}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label">
            Major
          </label>
          <p className="text-white print-value">
            {recruitmentForm.jurusan}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label">
            Experience Level
          </label>
          <p className="text-white print-value">
            {recruitmentForm.experienceLevel?.replace("_", " ") ||
              "Not specified"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 print-label">
            Applied Position
          </label>
          <p className="text-white print-value">
            {recruitmentForm.appliedPosition?.replace(/_/g, " ") ||
              "Not specified"}
          </p>
        </div>
        {recruitmentForm.workExperience && (
          <div className="md:col-span-2 print-grid-full">
            <label className="block text-sm font-medium text-gray-400 mb-2 print-label">
              Work Experience
            </label>
            {/* React Quill for displaying rich text - screen view with custom styling */}
            <div className="no-print work-experience-container">
              <div className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg overflow-hidden">
                <ReactQuill
                  value={recruitmentForm.workExperience}
                  readOnly={true}
                  theme="snow"
                  modules={{
                    toolbar: false,
                  }}
                  style={{
                    fontSize: "14px",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
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

      <style jsx global>{`
        .work-experience-container .ql-editor {
          background: transparent !important;
          color: #f3f4f6 !important;
          border: none !important;
          font-size: 14px !important;
          padding: 12px !important;
        }
        
        .work-experience-container .ql-container {
          border: none !important;
          background: transparent !important;
        }
        
        .work-experience-container .ql-snow {
          background: transparent !important;
          border: none !important;
        }
        
        .work-experience-container .ql-editor p {
          color: #f3f4f6 !important;
        }
        
        .work-experience-container .ql-editor strong {
          color: #ffffff !important;
        }
        
        .work-experience-container .ql-editor ul li {
          color: #f3f4f6 !important;
        }
        
        .work-experience-container .ql-editor ol li {
          color: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
};