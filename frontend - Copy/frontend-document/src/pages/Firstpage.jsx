import React from "react";
import "../stylesheets/firstpage.css"
import { useNavigate } from 'react-router-dom';

const Firstpage = () => {

    const navigate = useNavigate();


  return (
    // Main container with full viewport height and centered content
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      {/* Main content box with max width and proper spacing */}
      <div className="max-w-4xl mx-auto text-center">
        {/* "Powered by Advanced AI" badge with blue color */}
        <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full shadow-sm mb-8">
          <h2 className="text-sm font-medium">Powered by Advanced AI</h2>
        </div>
        
        {/* Main heading with blue AI */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Demystify Legal Documents with <span className="text-blue-600">AI</span>
        </h1>
        
        {/* Paragraph */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform complex legal documents into clear, understandable insights. Upload, analyze, and chat with your legal documents in seconds.
        </p>
        
        {/* Button container */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {/* Primary button */}
          <button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-200 transform hover:scale-105">
            Get Started Free →
          </button>
          
          {/* Sign In button */}
          <button onClick={() => navigate('/auth')} className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition duration-200 bg-white/50 backdrop-blur-sm hover:bg-white">
            Sign In
          </button>
        </div>
        
        {/* Features list */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-500 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Secure & Private</span>
          </div>
        </div>
        
        {/* Animated mouse icon with continuous up-down movement */}
        <div className="flex justify-center group cursor-pointer">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center group-hover:border-blue-600 transition-colors duration-300 relative">
            {/* Moving dot with continuous up-down animation */}
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full absolute top-1.5 animate-scroll group-hover:bg-blue-600 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Firstpage;