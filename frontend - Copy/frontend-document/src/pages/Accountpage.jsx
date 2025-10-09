
import React, { useState } from "react";
import { 
  FaEye, 
  FaEyeSlash, 
  FaLock, 
  FaEnvelope, 
  FaUser, 
  FaShieldAlt, 
  FaCreditCard,
  FaArrowLeft,
  FaCheckCircle,
  FaPaperPlane
} from "react-icons/fa";
import { useAuth } from "../context/Authcontext";
import '../stylesheets/accountpage.css';

const Accountpage = () => {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin', 'signup', 'forgot', 'reset', 'resend'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { login, isAuthenticated, signup } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      switch (activeTab) {
        case 'signin':
          console.log("🔄 Starting login process...");
          const loginSuccess = await login(formData.email, formData.password);
          
          if (loginSuccess) {
            setMessage({ type: 'success', text: 'Successfully signed in! Redirecting...' });
            // AuthContext will handle the redirect automatically
          } else {
            setMessage({ type: 'error', text: 'Invalid email or password. Please try again.' });
          }
          break;

        case 'signup': 
          if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            setIsLoading(false);
            return;
          }

          console.log("🔄 Starting signup process...");
          const result = await signup(formData.fullName, formData.email, formData.password);

          if (result.success) {
            setMessage({ type: 'success', text: result.message || 'Account created! Please sign in.' });
            
            setTimeout(() => {
              setActiveTab('signin');
              setFormData(prev => ({ 
                ...prev, 
                fullName: '', 
                password: '', 
                confirmPassword: '' 
              }));
            }, 3000);
          } else {
            setMessage({ type: 'error', text: result.message });
          }
          break;

        case 'forgot':
          console.log('Sending reset email to:', formData.email);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setMessage({ type: 'success', text: 'Reset instructions sent to your email!' });
          setActiveTab('reset');
          break;

        case 'reset':
          if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            break;
          }
          console.log('Resetting password with token:', formData.resetToken);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to sign in...' });
          
          setTimeout(() => {
            setActiveTab('signin');
            setFormData(prev => ({ 
              ...prev, 
              password: '', 
              confirmPassword: '', 
              resetToken: '' 
            }));
          }, 1500);
          break;

        case 'resend':
          console.log('Resending verification to:', formData.email);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setMessage({ type: 'success', text: 'Verification email sent!' });
          break;
      }
    } catch (error) {
      console.error("💥 Form submission error:", error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const goBack = () => {
    setActiveTab('signin');
    setMessage({ type: '', text: '' });
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'signin':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {/* <button
                type="button"
                onClick={() => setActiveTab('forgot')}
                className="text-blue-400 hover:text-blue-500 text-sm font-medium"
              >
                Forgot your password? Reset it
              </button> */}
              {/* <button
                type="button"
                onClick={() => setActiveTab('resend')}
                className="text-blue-400 hover:text-blue-500 text-sm font-medium"
              >
                Resend verification
              </button> */}
            </div>
          </>
        );

      case 'signup':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="password-toggle absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                By signing up, you agree to our{' '}
                <button type="button" className="text-blue-400 hover:text-blue-500 font-medium">
                  Terms of Service
                </button>
              </p>
            </div>
          </>
        );

      case 'forgot':
        return (
          <>
            <div className="text-center mb-6">
              <FaLock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Reset Your Password</h3>
              <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </>
        );

      case 'reset':
        return (
          <>
            <div className="text-center mb-6">
              <FaCheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Create New Password</h3>
              <p className="text-gray-600 mt-2">Enter your new password and reset token</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reset Token
              </label>
              <input
                name="resetToken"
                type="text"
                required
                value={formData.resetToken}
                onChange={handleInputChange}
                className="auth-input block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter the token from your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="password-toggle absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </>
        );

      case 'resend':
        return (
          <>
            <div className="text-center mb-6">
              <FaPaperPlane className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Resend Verification</h3>
              <p className="text-gray-600 mt-2">Enter your email to resend verification instructions</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  const getSubmitButtonText = () => {
    switch (activeTab) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Send Reset Instructions';
      case 'reset': return 'Reset Password';
      case 'resend': return 'Resend Verification';
      default: return 'Submit';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to LegalAI
          </h1>
          <p className="text-gray-600">
            {activeTab === 'signin' || activeTab === 'signup' 
              ? 'Sign in to your account or create a new one to get started'
              : ''}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Back Button for non-main tabs */}
          {(activeTab === 'forgot' || activeTab === 'reset' || activeTab === 'resend') && (
            <button
              onClick={goBack}
              className="flex items-center text-blue-400 hover:text-blue-500 mb-6 font-medium"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
          )}

          {/* Tabs - Only show for signin/signup */}
          {(activeTab === 'signin' || activeTab === 'signup') && (
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('signin')}
                className={`auth-tab flex-1 py-4 text-center text-lg ${
                  activeTab === 'signin' ? 'active text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`auth-tab flex-1 py-4 text-center text-lg ${
                  activeTab === 'signup' ? 'active text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm()}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                getSubmitButtonText()
              )}
            </button>
          </form>

          {/* Security Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FaCreditCard className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Auth Type - Only for signin/signup */}
        {(activeTab === 'signin' || activeTab === 'signup') && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {activeTab === 'signin' 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button
                onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
                className="text-blue-400 hover:text-blue-500 font-medium"
              >
                {activeTab === 'signin' ? 'Sign up now' : 'Sign in here'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accountpage;

