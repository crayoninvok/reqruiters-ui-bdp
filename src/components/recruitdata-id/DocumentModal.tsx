import React from "react";

interface DocumentModalProps {
  show: boolean;
  document: {
    url: string;
    name: string;
    type: string;
  } | null;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  show,
  document,
  onClose,
  onDownload,
}) => {
  if (!show || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 no-print">
      <div className="relative w-11/12 h-5/6 bg-white rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{document.name}</h3>
          <button
            onClick={onClose}
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
          {document.type === "image" ? (
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-full object-contain mx-auto"
            />
          ) : (
            <iframe
              src={`${document.url}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0"
              title={document.name}
            />
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => onDownload(document.url, document.name)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};