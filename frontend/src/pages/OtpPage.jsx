import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { FiCheckCircle } from 'react-icons/fi';

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the email passed from the signup page
  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] =useState(false);
  const [error, setError] = useState('');

  // For this demo, the correct OTP is hardcoded
  const CORRECT_OTP = '123456';

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (otp === CORRECT_OTP) {
      // If OTP is correct, log the user in.
      // In a real app, the backend would create the user account now.
      await login(email, 'password'); // We use a dummy password for the mock login
    } else {
      // If OTP is incorrect, show an error
      setError('Invalid OTP. Please try again.');
      setIsLoading(false);
    }
  };

  // If the user navigates to this page directly without an email,
  // redirect them to the signup page.
  if (!email) {
    return <Navigate to="/signup" />;
  }

  return (
    <AuthLayout title="Verify Your Account">
      <p className="text-center text-text-secondary mb-6">
        Enter the 6-digit code sent to <br />
        <strong className="text-text-primary">{email}</strong>
      </p>
      <p className="text-center text-xs text-primary mb-6">
        (For demo purposes, the code is <strong className="font-mono">123456</strong>)
      </p>
      
      {error && <p className="mb-4 text-center text-red-400">{error}</p>}

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <input 
            type="text" 
            placeholder="------" 
            maxLength="6" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required 
            className="w-full bg-surface border border-secondary rounded-lg py-3 px-4 text-center text-3xl tracking-[0.5em] text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition hover:bg-opacity-90 disabled:bg-opacity-50"
        >
          {isLoading ? <Spinner /> : <FiCheckCircle />}
          <span>{isLoading ? 'Verifying...' : 'Verify & Create Account'}</span>
        </motion.button>
      </form>
    </AuthLayout>
  );
};

export default OtpPage;