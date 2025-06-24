import React, { useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

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
        className="relative bg-white p-4 rounded-md max-h-[90vh] w-[80vw] overflow-y-auto faq-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <Worker workerUrl={workerUrl}>
          <Viewer fileUrl={file} />
        </Worker>
      </div>
    </div>
  );
}

export default PdfPreview;
