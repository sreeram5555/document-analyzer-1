
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DocumentUploader from '../components/DocumentUploader';
import DocumentList from '../components/DocumentList';
import { FiCpu, FiArchive } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedDocuments, setAnalyzedDocuments] = useState([]);
  const [error, setError] = useState('');

  // Helper function to generate mock data for a given file
  const generateMockAnalysis = (file) => ({
    summary: `Analysis summary for '${file.name}'. This document appears to be a standard contract outlining specific terms...`,
    keyDates: `Key dates identified include the effective date of October 4, 2025, and a termination clause valid for three years...`,
    entities: `The main parties involved are 'Global Tech Inc.' and 'Innovate Solutions LLC.'...`,
    obligations: `The primary obligation is for 'Innovate Solutions LLC' to provide services as detailed in Appendix A...`,
    risks: `A potential risk involves the intellectual property clause, which could be open to broad interpretation...`,
  });

  // This function now accepts an array of files to analyze
  const handleAnalysis = async (filesToAnalyze) => {
    setIsAnalyzing(true);
    setError('');

    // Create a promise for each file analysis
    const analysisPromises = filesToAnalyze.map(file => {
      return new Promise(async (resolve) => {
        // Simulate a varied network delay for each file
        await new Promise(res => setTimeout(res, 1500 + Math.random() * 2000));
        
        const analysisData = generateMockAnalysis(file);
        
        resolve({
          id: Date.now() + Math.random(), // Ensure unique ID
          file: { name: file.name, size: file.size, type: file.type },
          analysis: analysisData,
        });
      });
    });

    // Wait for all analyses to complete
    const newDocuments = await Promise.all(analysisPromises);

    // Add all the new documents to our state at once
    setAnalyzedDocuments(prevDocs => [...newDocuments.reverse(), ...prevDocs]);
    setIsAnalyzing(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-text-primary">Welcome, {user?.name.split(' ')[0]}!</h1>
        <p className="text-text-secondary">Ready to unlock insights? Upload a document to get started.</p>
      </motion.header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DocumentUploader onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
        
        <div className="bg-surface rounded-xl p-6 border border-secondary">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
            <FiArchive className="mr-3 text-primary" />
            Analyzed Documents
          </h2>
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center space-x-2 text-text-secondary p-4 bg-background/50 rounded-lg"
              >
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing your documents...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <DocumentList documents={analyzedDocuments} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;