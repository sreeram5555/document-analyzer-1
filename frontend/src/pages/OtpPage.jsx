// frontend/src/pages/OtpPage.jsx

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { FiCheckCircle } from 'react-icons/fi';

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // We'll use this to log the user in after verification

  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'OTP verification failed.');
        }

        // After successful verification, log the user in
        // We need a password, but since we don't have it here,
        // the login function in AuthContext will handle it
        alert('Verification successful! Please log in to continue.');
        navigate('/login');

    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };
  
  // Logic to resend OTP
  const handleResendOtp = async () => {
    // Add logic to call your /resend-otp endpoint
    try {
        await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        alert('A new OTP has been sent to your email.');
    } catch (error) {
        setError('Failed to resend OTP. Please try again.');
    }
  };


  if (!email) {
    return <Navigate to="/signup" />;
  }

  return (
    <AuthLayout title="Verify Your Account">
      <p className="text-center text-text-secondary mb-6">
        Enter the 6-digit code sent to <br />
        <strong className="text-text-primary">{email}</strong>
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
          <span>{isLoading ? 'Verifying...' : 'Verify Account'}</span>
        </motion.button>
      </form>
       <div className="text-center mt-4">
        <button onClick={handleResendOtp} className="text-sm text-primary hover:underline">
          Didn't receive code? Resend OTP
        </button>
      </div>
    </AuthLayout>
  );
};

export default OtpPage;