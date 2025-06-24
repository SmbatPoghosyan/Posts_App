import React, { useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

const renderLoader = () => (
  <div className="flex flex-col items-center justify-center p-8 text-primary-600">
    <svg
      className="w-16 h-16 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" className="opacity-30" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="19.07" y1="19.07" x2="16.24" y2="16.24" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="19.07" y1="4.93" x2="16.24" y2="7.76" />
    </svg>
  </div>
);

function PdfPreview({ file, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-lg max-h-[90vh] w-[80vw] overflow-y-auto faq-scroll border-2 border-primary-600 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Worker workerUrl={workerUrl}>
          <Viewer fileUrl={file} renderLoader={renderLoader} />
        </Worker>
      </div>
    </div>
  );
}

export default PdfPreview;
