import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for an existing session on app load
    try {
      const storedUser = localStorage.getItem('docu-analyzer-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
        setLoading(false);
    }
  }, []);

  // SIMULATED LOGIN FUNCTION
  const login = async (email, password) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const userData = { name: 'Alex Ryder', email: email, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}` };
        localStorage.setItem('docu-analyzer-user', JSON.stringify(userData));
        setUser(userData);
        navigate('/');
        resolve(true);
      }, 1500); // Simulate network delay
    });
  };

  // SIMULATED LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('docu-analyzer-user');
    setUser(null);
    navigate('/login');
  };

  const value = { user, login, logout, isAuthenticated: !!user, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};