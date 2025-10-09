
import React, { useState } from "react";
import { FaCloudUploadAlt, FaRobot, FaComments, FaTimes } from "react-icons/fa";
import "../stylesheets/secondpage.css";


import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const [selectedStep, setSelectedStep] = useState(null);
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      title: "Upload Document",
      description: "Simply drag and drop your PDF, DOC, or DOCX legal documents",
      icon: <FaCloudUploadAlt className="w-12 h-12 text-blue-400" />,
      modalContent: {
        title: "Upload Your Legal Documents",
        details: [
          "Supported formats: PDF, DOC, DOCX",
          "Maximum file size: 25MB",
          "Drag and drop interface",
          "Secure file encryption",
          "Multiple file upload support"
        ]
      }
    },
    {
      number: "2",
      title: "AI Analysis",
      description: "Our AI instantly analyzes and extracts key information",
      icon: <FaRobot className="w-12 h-12 text-blue-400" />,
      modalContent: {
        title: "AI-Powered Document Analysis",
        details: [
          "Instant processing of legal documents",
          "Key clause identification",
          "Risk assessment scoring",
          "Summary generation",
          "Important deadline extraction"
        ]
      }
    },
    {
      number: "3",
      title: "Ask Questions",
      description: "Chat with your documents to get instant clarifications",
      icon: <FaComments className="w-12 h-12 text-blue-400" />,
      modalContent: {
        title: "Interactive Document Chat",
        details: [
          "Natural language queries",
          "Instant clarifications",
          "Citation references",
          "Multiple language support",
          "Context-aware responses"
        ]
      }
    }
  ];

  const handleCardClick = (step) => {
    setSelectedStep(step);
  };

  const closeModal = () => {
    setSelectedStep(null);
  };

  return (
    <>
      <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase">How It Works</h2>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Three simple steps to understand your legal documents
            </h1>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(step)}
                className="how-it-works-card bg-white rounded-2xl p-8 cursor-pointer group"
              >
                {/* Step Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{step.number}</span>
                    </div>
                  </div>
                  {/* Icon */}
                  <div className="card-icon text-blue-400">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Learn More</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <button 
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
            onClick={() => navigate('/auth')}
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 modal-content relative z-10">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">{selectedStep.number}</span>
              </div>
              <div className="text-blue-400 mr-4">
                {selectedStep.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedStep.modalContent.title}</h2>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              {selectedStep.modalContent.details.map((detail, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-600">{detail}</p>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
              >
                Close
              </button>
              <button
                className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                onClick={() => navigate('/auth')}
              >
                Try It Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HowItWorks;