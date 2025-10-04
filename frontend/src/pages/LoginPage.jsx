// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Spinner from '../components/Spinner';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); // Get the login function from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the login function from AuthContext directly.
      // It will handle the API call, token storage, and navigation.
      

     const success = await login(email, password);

if (success) {
  // Only navigate if the login was successful
  navigate('/dashboard');
} else {
  // Otherwise, show an error
  setError('Invalid email or password. Please try again.');
}

    } catch (err) {
      // This will catch any unexpected errors during the login process.
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back!">
      {/* Display error messages */}
      {error && (
        <div className="mb-4 text-center text-red-400">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
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
          {isLoading ? <Spinner /> : <FiLogIn />}
          <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
        </motion.button>
      </form>
      <p className="mt-6 text-center text-text-secondary">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;