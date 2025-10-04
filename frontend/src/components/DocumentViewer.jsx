// frontend/src/components/DocumentViewer.jsx

import React from 'react';

const DocumentViewer = ({ file, extractedText }) => {
  return (
    <div className="flex-grow bg-background rounded-lg p-6 overflow-y-auto border border-secondary">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text-primary">{file.name}</h3>
        <p className="text-sm text-text-secondary">Extracted Text</p>
      </div>
      
      {/* --- THIS IS THE CHANGE --- */}
      {/* We use a <pre> tag to respect line breaks and formatting */}
      <pre className="whitespace-pre-wrap text-text-secondary text-sm font-sans">
        {extractedText ? extractedText : "No text was extracted from this document."}
      </pre>

    </div>
  );
};

export default DocumentViewer;