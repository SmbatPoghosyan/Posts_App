import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

function PdfPreview({ file, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(Math.min(800, window.innerWidth * 0.8));

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(Math.min(800, window.innerWidth * 0.8));
    };
    window.addEventListener('resize', handleResize);
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl leading-none text-gray-600 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from(new Array(numPages || 0), (el, index) => (
            <Page key={index} pageNumber={index + 1} width={pageWidth} className="mb-4" />
          ))}
        </Document>
      </div>
    </div>
  );
}

export default PdfPreview;
