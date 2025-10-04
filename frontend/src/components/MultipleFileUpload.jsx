// import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { FiUploadCloud, FiFileText, FiX } from 'react-icons/fi'; // Using react-icons

// // A small helper function to format bytes into a readable string
// const formatBytes = (bytes, decimals = 2) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// };

// const MultipleFileUpload = () => {
//   const [files, setFiles] = useState([]);

//   // useCallback is used for performance optimization
//   const onDrop = useCallback((acceptedFiles) => {
//     // You can add new files to the existing list
//     setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { // Optional: Specify accepted file types
//       'image/png': ['.png'],
//       'image/jpeg': ['.jpg', '.jpeg'],
//       'application/pdf': ['.pdf'],
//     }
//   });

//   // Function to remove a specific file from the list
//   const removeFile = (fileName) => {
//     setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
//   };

//   const fileList = files.map(file => (
//     <li key={file.path} className="flex items-center justify-between p-3 my-2 bg-gray-100 rounded-md shadow-sm">
//       <div className="flex items-center">
//         <FiFileText className="w-6 h-6 mr-3 text-gray-500" />
//         <span className="font-medium text-gray-700">{file.name}</span>
//         <span className="ml-3 text-sm text-gray-500">({formatBytes(file.size)})</span>
//       </div>
//       <button
//         onClick={() => removeFile(file.name)}
//         className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-red-600 focus:outline-none"
//         aria-label={`Remove ${file.name}`}
//       >
//         <FiX className="w-5 h-5" />
//       </button>
//     </li>
//   ));

//   return (
//     <div className="w-full max-w-2xl p-4 mx-auto">
//       {/* The Dropzone Area */}
//       <div
//         {...getRootProps()}
//         className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
//           ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
//       >
//         <input {...getInputProps()} />
//         <FiUploadCloud className="w-12 h-12 text-gray-400" />
//         {isDragActive ? (
//           <p className="mt-2 text-lg font-semibold text-blue-600">Drop the files here ...</p>
//         ) : (
//           <p className="mt-2 text-gray-600">
//             Drag & drop some files here, or <span className="font-semibold text-blue-500">click to select files</span>
//           </p>
//         )}
//         <p className="mt-1 text-xs text-gray-500">PNG, JPG, PDF accepted</p>
//       </div>

//       {/* The File List */}
//       {files.length > 0 && (
//         <aside className="mt-6">
//           <h4 className="text-lg font-semibold text-gray-800">Selected Files:</h4>
//           <ul className="mt-2">{fileList}</ul>
//         </aside>
//       )}
//     </div>
//   );
// };

// export default MultipleFileUpload;
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFileText, FiX, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to format file size
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const MultipleFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    setUploadSuccess(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    }
  });

  const removeFile = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadSuccess(false);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          setFiles([]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="w-12 h-12 text-gray-400 mb-2" />
        <p className="mt-2 text-gray-600 text-center">
          {isDragActive ? "Drop files now!" : <>Drag & drop files here, or <span className="font-semibold text-indigo-600">browse</span></>}
        </p>
        <p className="mt-1 text-xs text-gray-500">Supports Images, PDF, and TXT files</p>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Selected Files</h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              <AnimatePresence>
                {files.map(file => (
                  <motion.li
                    key={file.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                  >
                    <div className="flex items-center min-w-0">
                      <FiFileText className="w-6 h-6 mr-4 text-gray-500 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                          <span className="font-medium text-gray-800 truncate">{file.name}</span>
                          <span className="text-sm text-gray-500">{formatBytes(file.size)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-red-600"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                {isUploading ? 'Uploading...' : `Upload ${files.length} Files`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isUploading && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${uploadProgress}%` }}
          ></motion.div>
        </div>
      )}

      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 p-4 flex items-center bg-green-100 text-green-800 rounded-lg"
          >
            <FiCheckCircle className="w-6 h-6 mr-3" />
            <p className="font-semibold">Files uploaded successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultipleFileUpload;

