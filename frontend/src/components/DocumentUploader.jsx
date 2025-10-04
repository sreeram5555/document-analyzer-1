
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const DocumentUploader = ({ onAnalyze, isAnalyzing }) => {
  const [files, setFiles] = useState([]);
  const { token, user } = useAuth();

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/html': ['.html', '.htm'],
    },
    maxFiles: 1 // Only allow one file at a time to match the handleAnalysis function
  });
  
  const removeFile = (fileNameToRemove) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileNameToRemove));
  };
  
  const handleAnalyzeClick = async () => {
    if (files.length === 0 || !token) return;

    const fileToUpload = files[0];
    const formData = new FormData();
    formData.append("file", fileToUpload); 
    formData.append("user_id", user?._id); 

    try {
        // Pass both the form data and the original file object
        await onAnalyze(formData, fileToUpload); 
        setFiles([]);
    } catch (err) {
        alert(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-secondary flex flex-col">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Upload Document</h2>
      <div {...getRootProps()} className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-secondary hover:border-primary/50'}`}>
        <input {...getInputProps()} />
        <FiUploadCloud className="text-5xl text-primary mb-4" />
        <p className="text-text-primary font-semibold">Drag & drop a file here, or click to select</p>
        <p className="text-sm text-text-secondary mt-1">Supports: PDF, HTML</p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 flex-grow space-y-2 max-h-48 overflow-y-auto pr-2">
            <h3 className="font-semibold text-text-secondary text-sm">Ready for Analysis:</h3>
            {files.map(file => (
                <div key={file.path} className="flex items-center bg-green-500/10 p-2 rounded-md">
                    <FiFile className="text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-text-primary text-sm truncate" title={file.name}>{file.name}</span>
                    <button onClick={() => removeFile(file.name)} className="ml-auto text-text-secondary hover:text-red-500"><FiX /></button>
                </div>
            ))}
        </div>
      )}

      <motion.button onClick={handleAnalyzeClick} disabled={files.length === 0 || isAnalyzing} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center transition disabled:bg-opacity-50 disabled:cursor-not-allowed">
        {isAnalyzing ? `Analyzing...` : `Analyze Document`}
      </motion.button>
    </div>
  );
};

export default DocumentUploader;