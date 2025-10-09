// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log("🛡️ ProtectedRoute - Auth status:", { 
    isAuthenticated, 
    loading, 
    currentPath: window.location.pathname 
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  console.log("✅ Authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;