import React from "react";
import { RecruitmentForm } from "@/types/types";

interface PhotoModalProps {
  show: boolean;
  recruitmentForm: RecruitmentForm | null;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  show,
  recruitmentForm,
  onClose,
  onDownload,
}) => {
  if (!show || !recruitmentForm?.documentPhotoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 no-print">
      <div className="relative max-w-4xl max-h-full p-4">
        <button
          onClick={onClose}
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
              onDownload(
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
