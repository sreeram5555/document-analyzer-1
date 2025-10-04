import React from "react";
import { NavLink } from "react-router-dom";

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar / Navbar */}
      <nav className="w-64 bg-surface p-4 flex flex-col space-y-4">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md font-medium ${
              isActive ? "bg-primary text-white" : "text-text-primary hover:bg-secondary"
            }`
          }
        >
          Profile
        </NavLink>

        {/* 👉 Add Contact button beside/under Profile */}
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md font-medium ${
              isActive ? "bg-primary text-white" : "text-text-primary hover:bg-secondary"
            }`
          }
        >
          Contact
        </NavLink>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
};

export default MainLayout;
