
import React from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiUser, FiMessageSquare, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user data
import Header from "./Header";


const MainLayout = ({ children }) => {
  const { user } = useAuth(); // Get the logged-in user details

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <nav className="w-64 flex-shrink-0 bg-surface p-4 flex flex-col border-r border-secondary">
        <div>
          <h1 className="text-xl font-bold text-center py-4 mb-2 text-primary">DocuAnalyzer</h1>
          
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-text-secondary hover:bg-secondary hover:text-text-primary"
              }`
            }
          >
            <FiGrid className="mr-3" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-text-secondary hover:bg-secondary hover:text-text-primary"
              }`
            }
          >
            <FiUser className="mr-3" />
            Profile
          </NavLink>
          
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-text-secondary hover:bg-secondary hover:text-text-primary"
              }`
            }
          >
            <FiMessageSquare className="mr-3" />
            Chatbot
          </NavLink>
          
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-text-secondary hover:bg-secondary hover:text-text-primary"
              }`
            }
          >
            <FiPhone className="mr-3" />
            Contact
          </NavLink>
        </div>

        {/* Profile Section at the Bottom */}
        <div className="mt-auto">
          {user && (
            <div className="flex items-center p-2 rounded-lg bg-secondary/50">
              <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
              <div className="ml-3 overflow-hidden">
                <p className="font-semibold text-sm text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-text-secondary truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>

      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;