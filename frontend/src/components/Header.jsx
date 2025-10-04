import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { FiCpu } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="bg-surface/80 backdrop-blur-sm border-b border-secondary sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <Link to="/" className="flex items-center space-x-2">
            <FiCpu className="text-primary h-8 w-8" />
            <span className="text-xl font-bold text-text-primary">
              Docu<span className="text-primary">Analyzer</span> AI
            </span>
          </Link>
          
          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </nav>
    </header>
  );
};

export default Header;