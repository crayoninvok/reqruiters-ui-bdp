import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextViewerProps {
  content: string;
  className?: string;
  maxHeight?: string;
}

const RichTextViewer: React.FC<RichTextViewerProps> = ({ 
  content, 
  className = "",
  maxHeight = "200px"
}) => {
  // Custom toolbar configuration for read-only mode (empty to hide toolbar)
  const modules = {
    toolbar: false,
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align',
    'code-block'
  ];

  return (
    <div className={`rich-text-viewer ${className}`}>
      <style jsx global>{`
        .rich-text-viewer .ql-editor {
          padding: 12px;
          font-size: 14px;
          line-height: 1.6;
          max-height: ${maxHeight};
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #f8fafc;
        }
        
        .rich-text-viewer .ql-container {
          border: none;
          font-family: inherit;
        }
        
        .rich-text-viewer .ql-editor p {
          margin-bottom: 8px;
        }
        
        .rich-text-viewer .ql-editor ul, 
        .rich-text-viewer .ql-editor ol {
          margin: 8px 0;
          padding-left: 20px;
        }
        
        .rich-text-viewer .ql-editor h1,
        .rich-text-viewer .ql-editor h2,
        .rich-text-viewer .ql-editor h3 {
          margin: 12px 0 8px 0;
          font-weight: 600;
        }
        
        .rich-text-viewer .ql-editor strong {
          font-weight: 600;
        }
        
        .rich-text-viewer .ql-editor em {
          font-style: italic;
        }
        
        .rich-text-viewer .ql-editor u {
          text-decoration: underline;
        }
        
        .rich-text-viewer .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 12px;
          margin: 12px 0;
          font-style: italic;
          color: #64748b;
        }
        
        .rich-text-viewer .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .rich-text-viewer .ql-editor a:hover {
          color: #1d4ed8;
        }
        
        /* Print styles */
        @media print {
          .rich-text-viewer .ql-editor {
            border: 1px solid #e2e8f0 !important;
            background: white !important;
            padding: 8px !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          
          .rich-text-viewer .ql-editor p {
            margin-bottom: 6px !important;
          }
          
          .rich-text-viewer .ql-editor ul, 
          .rich-text-viewer .ql-editor ol {
            margin: 6px 0 !important;
            padding-left: 16px !important;
          }
          
          .rich-text-viewer .ql-editor h1,
          .rich-text-viewer .ql-editor h2,
          .rich-text-viewer .ql-editor h3 {
            margin: 8px 0 4px 0 !important;
            font-weight: 600 !important;
          }
        }
      `}</style>
      
      <ReactQuill
        value={content}
        readOnly={true}
        theme="snow"
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextViewer;