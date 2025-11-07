// frontend/src/components/Sidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navItems } from "../config/nav.config";
import { useSocietyContext } from "../context/SocietyContext";
import SocietySwitcher from "./SocietySwitcher";
import { Menu, X } from "lucide-react";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { activeSociety } = useSocietyContext();
  const location = useLocation();

  // Use 'member' as the fallback role for residents, otherwise use the exact role (admin, owner, tenant)
  const role = activeSociety?.role || "member";
  const menuLinks = navItems[role] || navItems.member;

  return (
    <>
      {/* Sidebar - Desktop & Mobile */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 pt-5 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center">
              {/* Using Logo from public folder as in Navbar.jsx */}
              <img
                src="/assets/logo.png"
                alt="CivilCare Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Society Switcher in Sidebar (for consistency) */}
          <div className="mb-6 p-2 border-b border-gray-200 dark:border-gray-800">
            <SocietySwitcher />
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto space-y-2">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase mb-2 px-2">
              Menu ({activeSociety?.role?.toUpperCase()})
            </p>
            {menuLinks.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                end={item.exact}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Footer/Version */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-600 text-center">
              CivilCare v1.0 | Made with ❤️
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
