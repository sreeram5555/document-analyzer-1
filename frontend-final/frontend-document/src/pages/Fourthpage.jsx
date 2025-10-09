import React from "react";
import { 
  FaComments, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaShieldAlt,
  FaRocket,
  FaUsers,
  FaCheckCircle
} from "react-icons/fa";
import '../stylesheets/fourthpage.css'
import { useNavigate } from "react-router-dom";

const Forthpage = () => {

  const navigate = useNavigate();
  const features = [
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "AI-Powered Chat",
      description: "Ask questions in plain language and get instant answers about your documents"
    },
    {
      icon: <FaFileAlt className="w-8 h-8" />,
      title: "Smart Summaries",
      description: "Get concise summaries highlighting the most important terms and conditions"
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8" />,
      title: "Important Dates",
      description: "Automatically extract and track deadlines, renewals, and key dates"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your documents are encrypted and never shared with third parties"
    }
  ];

  const benefits = [
    "No credit card required",
    "Start analyzing in seconds",
    "256-bit encryption",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase mb-4">
              Powerful Features
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything you need to understand legal documents
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology designed to make legal documents accessible to everyone
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white rounded-xl p-6 text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 feature-icon text-blue-400 group-hover:bg-blue-400 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Smart Summaries Focus */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaFileAlt className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Smart Document Summaries
                  </h3>
                  <p className="text-gray-600">
                    Get concise summaries highlighting the most important terms and conditions. 
                    Our AI identifies key clauses, obligations, and risks in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Enterprise-Grade Security
                  </h3>
                  <p className="text-gray-600">
                    Your documents are encrypted end-to-end and never shared with third parties. 
                    We maintain the highest standards of data privacy and security.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center">
                <FaRocket className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 mb-6">
                  Process complex legal documents in seconds, not hours
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">99.9%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">24/7</div>
                    <div className="text-sm text-gray-600">Availability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Understand Your Legal Documents?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust LegalAI for document analysis
          </p>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FaCheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button onClick={() => navigate('/auth')}  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 inline-flex items-center space-x-2">
            <span>Get Started Free</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-blue-300 border-opacity-30">
            <p className="text-blue-100 mb-6">Trusted by legal professionals worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="text-sm">Law Firms</div>
              <div className="text-sm">Businesses</div>
              <div className="text-sm">Individuals</div>
              <div className="text-sm">Legal Teams</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Forthpage;