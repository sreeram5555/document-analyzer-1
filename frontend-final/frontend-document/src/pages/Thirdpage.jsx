

import React, { useState } from "react";
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileAlt,FaRobot,FaComments } from "react-icons/fa";
import "../stylesheets/thirdpage.css"
import { useNavigate } from "react-router-dom";

const Thirdpage = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    console.log(file);
    // Validate file type
    const allowedTypes = ['.pdf'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid file type (PDF)');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getFileIcon = (fileName) => {
    
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="w-8 h-8 text-red-500" />;
      
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Try It Now
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your first document and see the magic happen
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-12">
          <div className="w-24 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Upload Your Document
          </h2>

          {/* Upload Area */}
          <div
            className={`upload-area rounded-xl p-12 text-center relative cursor-pointer ${
              isDragOver ? 'drag-over' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="file-input"
              onChange={handleFileInput}
              accept=".pdf"
            />
            
            {!selectedFile ? (
              <>
                <FaCloudUploadAlt className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Click here to select a file or drag and drop
                </p>
                <p className="text-gray-500">
                  Supports PDF File Only
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                {getFileIcon(selectedFile.name)}
                <p className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                  {selectedFile.name}
                </p>
                <p className="text-gray-500 mb-4">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-blue-400 hover:text-blue-500 font-medium"
                >
                  Choose different file
                </button>
              </div>
            )}
          </div>

          {/* File Type Icons */}
          <div className="flex justify-center items-center space-x-8 mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col items-center">
              <FaFilePdf className="w-8 h-8 text-red-400" />
              <span className="text-sm text-gray-600 mt-2">PDF</span>
            </div>
            
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              className={`px-8 py-3 rounded-lg font-semibold transition duration-200 ${
                selectedFile
                  ? 'bg-blue-400 hover:bg-blue-500 text-white transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedFile}
              onClick={() => navigate('/auth')}
            >
              Analyze Document
            </button>
            <button
              onClick={() => setSelectedFile(null)}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRobot className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-gray-600 text-sm">Instant key information extraction</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaComments className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ask Questions</h3>
            <p className="text-gray-600 text-sm">Chat with your document</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCloudUploadAlt className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Upload</h3>
            <p className="text-gray-600 text-sm">Your documents are protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thirdpage;