import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiChevronRight, FiInbox } from 'react-icons/fi';

const DocumentList = ({ documents }) => {
  const navigate = useNavigate();

  if (documents.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] text-text-secondary">
            <FiInbox size={48} className="mb-4" />
            <p>Your analyzed documents will appear here.</p>
        </div>
    );
  }

  // Navigate to the detail page, passing the document data in the state
  const handleViewDetails = (doc) => {
    navigate(`/document/${doc.id}`, { state: { document: doc } });
  };

  return (
    <div className="mt-4 space-y-3 max-h-[450px] overflow-y-auto pr-2">
      <AnimatePresence>
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleViewDetails(doc)}
            className="flex items-center p-4 bg-background/60 rounded-lg border border-secondary hover:border-primary hover:bg-primary/10 cursor-pointer transition-all"
          >
            <FiFileText className="text-primary text-2xl flex-shrink-0" />
            <div className="ml-4 flex-grow overflow-hidden">
              <p className="text-text-primary font-medium truncate">{doc.file.name}</p>
              <p className="text-xs text-text-secondary">
                {(doc.file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <FiChevronRight className="ml-4 text-text-secondary flex-shrink-0" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DocumentList;