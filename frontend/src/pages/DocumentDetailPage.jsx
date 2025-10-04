import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnalysisDisplay from '../components/AnalysisDisplay';
import DocumentViewer from '../components/DocumentViewer'; // A new mock viewer component
import { FiArrowLeft, FiFileText, FiCpu } from 'react-icons/fi';

const DocumentDetailPage = () => {
  const location = useLocation();
  const { document } = location.state || {}; // Get the document data passed from the list

  // If a user navigates here directly without data, redirect them
  if (!document) {
    return <Navigate to="/" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto"
    >
      <div className="mb-6">
        <Link 
          to="/" 
          className="flex items-center text-sm text-text-secondary hover:text-primary transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-text-primary mt-2 truncate flex items-center">
            <FiFileText className="mr-3 text-primary" />
            {document.file.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Mock Document Viewer */}
        <div className="bg-surface rounded-xl p-6 border border-secondary h-[75vh] flex flex-col">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Document Preview</h2>
            <DocumentViewer file={document.file} />
        </div>

        {/* Right Column: AI Analysis */}
        <div className="bg-surface rounded-xl p-6 border border-secondary h-[75vh] flex flex-col">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <FiCpu className="mr-3 text-primary" />
                AI Analysis Report
            </h2>
            <div className="flex-grow overflow-y-auto">
                <AnalysisDisplay result={document.analysis} />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentDetailPage;