import React, { useEffect } from 'react';

interface SimpleDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    url: string;
    name: string;
    type: 'image' | 'pdf';
  } | null;
  onDownload: (url: string, name: string) => void;
}

const SimpleDocumentModal: React.FC<SimpleDocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  onDownload,
}) => {
  // Auto-open PDFs in new tab and close modal
  useEffect(() => {
    if (isOpen && document && document.type === 'pdf') {
      window.open(document.url, '_blank');
      onClose();
    }
  }, [isOpen, document, onClose]);

  if (!isOpen || !document) return null;

  // Only handle images in modal, PDFs open in new tab
  if (document.type === 'pdf') return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (document) {
      onDownload(document.url, document.name);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 no-print"
      onClick={handleBackdropClick}
    >
      <div className="relative w-11/12 h-5/6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {document.name}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Close document modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Only for Images */}
        <div className="p-4 h-full overflow-hidden">
          <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-full object-contain bg-gray-50 dark:bg-gray-900"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-document.png";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDocumentModal;