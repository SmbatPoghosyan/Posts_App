import React, { useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

const renderLoader = (percentages) => (
  <div className="flex flex-col items-center justify-center p-8 text-primary-600">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent border-b-transparent rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        🛞
      </div>
    </div>
    <span className="mt-3 font-semibold">{Math.round(percentages)}%</span>
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
