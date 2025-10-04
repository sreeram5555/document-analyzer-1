// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('docu-analyzer-token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (token) {
        try {
          const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setUser({ ...data.user, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}` });
          } else {
            // Token is invalid or expired
            localStorage.removeItem('docu-analyzer-token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem('docu-analyzer-token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // This is now the ONLY function that calls the login API
  const login = async (email, password) => {
    try {
        const res = await fetch('https://document-analyzer-1-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Login failed");
        }

        console.log("Login response:", res);
        const data = await res.json();
        localStorage.setItem('docu-analyzer-token', data.token);
        setToken(data.token); // This triggers the useEffect above to fetch user data
        
        navigate('/');
        return true; // Return true on success

    } catch (error) {
        console.error("Login error from context:", error);
        return false; // Return false on failure
    }
  };

  const logout = () => {
    localStorage.removeItem('docu-analyzer-token');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = { user, token, login, logout, isAuthenticated: !!user, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};