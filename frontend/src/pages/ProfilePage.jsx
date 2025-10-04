// frontend/src/pages/ProfilePage.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiEdit2 } from 'react-icons/fi';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-surface p-8 rounded-2xl border border-secondary shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-primary"
            />
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-opacity-80 transition">
              <FiEdit2 size={16} />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">{user.name}</h1>
            <p className="text-text-secondary">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 border-t border-secondary pt-6 space-y-4">
          <div className="flex items-center">
            <FiUser className="text-primary mr-4" />
            <span className="text-text-secondary">Full Name: {user.name}</span>
          </div>
          <div className="flex items-center">
            <FiMail className="text-primary mr-4" />
            <span className="text-text-secondary">Email: {user.email}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;