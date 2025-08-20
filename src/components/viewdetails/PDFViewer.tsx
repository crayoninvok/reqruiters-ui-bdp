import React, { useState } from 'react';

interface PDFViewerProps {
  url: string;
  title: string;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, title, className = "" }) => {
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setLoadError(true);
    setIsLoading(false);
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  const forceDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadError) {
    return (
      <div className={`flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 ${className}`}>
        <div className="text-center p-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Cannot display PDF
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The PDF cannot be displayed in this browser.
          </p>
          <div className="space-y-2">
            <button
              onClick={openInNewTab}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Open in New Tab
            </button>
            <button
              onClick={forceDownload}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading PDF...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={url}
        className="w-full h-full border-0 rounded-lg"
        title={title}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        loading="lazy"
      />
      
      {/* Fallback buttons */}
      <div className="absolute bottom-2 right-2 flex space-x-2 opacity-75 hover:opacity-100 transition-opacity">
        <button
          onClick={openInNewTab}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md font-medium transition-colors"
          title="Open in new tab"
        >
          Open
        </button>
        <button
          onClick={forceDownload}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md font-medium transition-colors"
          title="Download PDF"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;