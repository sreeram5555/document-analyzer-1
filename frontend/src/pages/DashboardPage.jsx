
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DocumentUploader from '../components/DocumentUploader';
import DocumentList from '../components/DocumentList';
import { FiArchive } from 'react-icons/fi';
import axios from 'axios';
import Spinner from '../components/Spinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedDocuments, setAnalyzedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      if (token) {
        setIsLoading(true);
        try {
          const res = await axios.get(`${API_BASE_URL}/api/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.data.success) {
            const formattedDocs = res.data.documents.map(doc => ({
                id: doc._id,
                file: { name: doc.DocumentName, size: 0 },
                analysis: { summary: doc.summary || 'Summary not available.' }
            }));
            setAnalyzedDocuments(formattedDocs.reverse());
          }
        } catch (err) {
          setError('Could not fetch existing documents.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [token]);

  const handleAnalysis = async (formData, originalFile) => {
    setIsAnalyzing(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/documents/upload-document`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = res.data;
      if (!result.success) throw new Error(result.message);
      
      const newDocument = {
        id: result.data.documentId,
        file: { name: result.data.file_name, size: originalFile.size },
        analysis: result.data.structured_data,
        extracted_text: result.data.extracted_text
      };
      setAnalyzedDocuments(prevDocs => [newDocument, ...prevDocs]);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
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
          {error && <div className="text-red-400 text-center p-4 bg-red-500/10 rounded-lg">{error}</div>}
          {isLoading ? (
            <div className="flex justify-center items-center h-full"><Spinner /></div>
          ) : (
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div className="flex items-center justify-center space-x-2 text-text-secondary p-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing your document...</span>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <DocumentList documents={analyzedDocuments} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;