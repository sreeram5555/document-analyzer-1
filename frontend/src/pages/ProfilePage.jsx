import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import Spinner from '../components/Spinner';
import { FiUser, FiMail, FiLock, FiSend } from 'react-icons/fi';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // This function now simulates requesting an OTP from a backend
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call to request OTP
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`Simulating OTP request for ${email}. In a real app, an email would be sent.`);
    
    // On success, navigate to the OTP page and pass the email along
    // This ensures the OTP page knows who is trying to verify.
    navigate('/verify-otp', { state: { email: email } });
    
    setIsLoading(false);
  };

  return (
    <AuthLayout title="Create Your Account">
      {error && <p className="mb-4 text-center text-red-400">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-6">
        <div className="relative">
          <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-surface border border-secondary rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
        <div className="relative">
          <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface border border-secondary rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
        <div className="relative">
          <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-surface border border-secondary rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition hover:bg-opacity-90 disabled:bg-opacity-50"
        >
          {isLoading ? <Spinner /> : <FiSend />}
          <span>{isLoading ? 'Sending OTP...' : 'Send Verification Code'}</span>
        </motion.button>
      </form>
      <p className="mt-6 text-center text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;