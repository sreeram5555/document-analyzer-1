import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const SignupPage = () => {
    const navigate = useNavigate();

    // SIMULATED SIGNUP: just navigates to OTP page
    const handleSignup = (e) => {
        e.preventDefault();
        navigate('/verify-otp');
    }

  return (
    <AuthLayout title="Create Your Account">
        <form onSubmit={handleSignup} className="space-y-6">
            <div>
                 <input type="text" placeholder="Full Name" required className="w-full bg-surface border border-secondary rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"/>
            </div>
             <div>
                 <input type="email" placeholder="Email Address" required className="w-full bg-surface border border-secondary rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"/>
            </div>
            <div>
                 <input type="password" placeholder="Password" required className="w-full bg-surface border border-secondary rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"/>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg transition hover:bg-opacity-90">
                Create Account
            </button>
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