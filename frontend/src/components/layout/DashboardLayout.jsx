// frontend/src/components/layout/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import SocietySwitcher from "../SocietySwitcher";
import { Menu } from "lucide-react";
import { useSocietyContext } from "../../context/SocietyContext";
import AdminDashboard from "../../pages/dashboard/AdminDashboard";
import ResidentDashboard from "../../pages/dashboard/ResidentDashboard";
import { navItems } from "../../config/nav.config";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeSociety } = useSocietyContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic Dashboard Rendering based on role
  const role = activeSociety?.role;
  let DashboardComponent = ResidentDashboard; // Default for member, owner, tenant
  let pageTitle = "Dashboard";

  if (role === "admin") {
    DashboardComponent = AdminDashboard;
  }

  // Determine the current page title for the header
  if (location.pathname !== "/app/dashboard" && activeSociety) {
    const navConfig =
      activeSociety.role === "admin" ? navItems.admin : navItems.member;
    const currentItem = navConfig.find(
      (item) => location.pathname === item.href
    );
    pageTitle = currentItem?.name || "Page";
  } else if (location.pathname === "/app/dashboard") {
    pageTitle = `${activeSociety?.societyName} Dashboard`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col transition-all duration-300">
        {/* Header/Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 h-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 hidden sm:block">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Society Switcher is now inside the Sidebar for better mobile access, but can be kept here for quick access */}
            {/* Keeping it simple - SocietySwitcher logic is inside Sidebar now. */}
            <h1 className="text-sm font-medium text-gray-800 dark:text-gray-100 sm:hidden">
              {pageTitle.length > 20
                ? `${pageTitle.substring(0, 17)}...`
                : pageTitle}
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet context={{ DashboardComponent }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
