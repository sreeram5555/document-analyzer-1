import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from 'react-icons/fi';

// This component is now responsible for handling an array of files.
const DocumentUploader = ({ onAnalyze, isAnalyzing }) => {
  // State is now an array to hold multiple files
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // Add the newly dropped files to the existing list
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    // We remove `maxFiles: 1` to allow multiple uploads
  });
  
  // Function to remove a specific file from the list
  const removeFile = (fileNameToRemove) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileNameToRemove));
  };
  
  const handleAnalyzeClick = () => {
    if (files.length > 0) {
      onAnalyze(files); // Pass the entire array of files to the dashboard
      setFiles([]); // Clear the list after starting analysis
    }
  };

//     const handleAnalyzeClick = async () => {
//   if (files.length > 0) {
//     const formData = new FormData();
//     files.forEach(file => {
//       formData.append("documents", file); // field name must match multer's .array("documents")
//     });

//     try {
//       const res = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData, // enctype=multipart/form-data is automatically set by FormData
//       });

//       const data = await res.json();
//       console.log("Upload response:", data);
//       setFiles([]); // clear after upload
//     } catch (err) {
//       console.error("Upload error:", err);
//     }
//   }
// };

  return (
    <div className="bg-surface rounded-xl p-6 border border-secondary flex flex-col">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Upload Documents</h2>
      
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-secondary hover:border-primary/50'}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="text-5xl text-primary mb-4" />
        <p className="text-text-primary font-semibold">Drag & drop files here, or click to select</p>
        <p className="text-sm text-text-secondary mt-1">Supports: PDF, DOCX, TXT</p>
      </div>
      
      {/* Files List Area */}
      {files.length > 0 && (
        <div className="mt-4 flex-grow space-y-2 max-h-48 overflow-y-auto pr-2">
            <h3 className="font-semibold text-text-secondary text-sm">Ready for Analysis:</h3>
            {files.map(file => (
                <div key={file.path} className="flex items-center bg-green-500/10 p-2 rounded-md">
                    <FiFile className="text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-text-primary text-sm truncate" title={file.name}>{file.name}</span>
                    <button onClick={() => removeFile(file.name)} className="ml-auto text-text-secondary hover:text-red-500">
                        <FiX />
                    </button>
                </div>
            ))}
        </div>
      )}

      <motion.button
        onClick={handleAnalyzeClick}
        disabled={files.length === 0 || isAnalyzing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center transition disabled:bg-opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? `Analyzing...` : `Analyze ${files.length} Document${files.length === 1 ? '' : 's'}`}
      </motion.button>
    </div>
  );
};


export default DocumentUploader;