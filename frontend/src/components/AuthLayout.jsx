import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ title, children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-secondary">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="w-full max-w-md p-8 space-y-8 bg-surface rounded-2xl shadow-2xl border border-secondary"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-text-primary">{title}</h2>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
