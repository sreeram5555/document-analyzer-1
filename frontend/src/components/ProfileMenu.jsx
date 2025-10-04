import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiSettings, FiX } from 'react-icons/fi';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuVariants = {
    closed: { scale: 0, originX: "100%", originY: "100%" },
    open: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="mb-4 bg-surface rounded-lg shadow-2xl border border-secondary w-56 overflow-hidden"
          >
            <div className="p-3 border-b border-secondary">
                <p className="font-bold text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-text-secondary truncate">{user.email}</p>
            </div>
            <ul className="py-2">
                <motion.li variants={itemVariants}><Link to="/profile" className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-primary/20 hover:text-primary"><FiUser className="mr-3" /> View Profile</Link></motion.li>
                <motion.li variants={itemVariants}><button className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-primary/20 hover:text-primary"><FiSettings className="mr-3" /> Settings</button></motion.li>
                <motion.li variants={itemVariants}><button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"><FiLogOut className="mr-3" /> Logout</button></motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
      >
        <AnimatePresence mode="wait">
            <motion.div
                key={isOpen ? 'close' : 'open'}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {isOpen ? <FiX size={24} /> : <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-surface"/>}
            </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ProfileMenu;