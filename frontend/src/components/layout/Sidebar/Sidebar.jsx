import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Wrench,
  Users,
  Bell,
  Mail,
  User,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { useSocietyContext } from "../../../contexts/SocietyContext";

const adminMenu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Buildings", path: "/admin/buildings", icon: Building2 },
  { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { name: "Complaints", path: "/admin/complaints", icon: Wrench },
  { name: "Residents", path: "/admin/residents", icon: Users },
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
  { name: "Profile", path: "/admin/profile", icon: User },
];

const userMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Announcements", path: "/user/announcements", icon: Megaphone },
  { name: "Raise Complaint", path: "/user/raise-complaint", icon: Mail },
  { name: "Residents", path: "/user/residents", icon: Users },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile", icon: User },
];

const Sidebar = () => {
  const { activeRole } = useSocietyContext();
  const [open, setOpen] = useState(window.innerWidth > 1000);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

  const menu = activeRole === "admin" ? adminMenu : userMenu;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1000) {
        setOpen(true);
        setIsMobile(false);
      } else {
        setOpen(false);
        setIsMobile(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ✅ MENU ICON - MOBILE PAR JAB SIDEBAR CLOSED HO */}
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-20 left-4 z-[60] bg-white text-indigo-600 p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-indigo-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* ✅ OVERLAY - SIRF MOBILE PAR DIKHEGA */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR - DESKTOP PAR ALWAYS VISIBLE, MOBILE PAR TOGGLE */}
      <aside
        className={`
          fixed top-0 left-0 z-50 bg-white h-full w-64
          shadow-xl transition-transform duration-300 ease-in-out
          ${
            !isMobile
              ? "translate-x-0"
              : open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* SIDEBAR HEADER - USER PANEL TEXT KE SAATH MENU ICON */}
        <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100">
          {/* LEFT SIDE - MENU ICON + USER PANEL TEXT (MOBILE ONLY) */}
          {isMobile ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
                aria-label="Close menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-gray-800">User Panel</h2>
            </div>
          ) : (
            // DESKTOP - CIVILCARE LOGO
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CivilCare
            </h2>
          )}

          {/* RIGHT SIDE - CLOSE X ICON (MOBILE ONLY) */}
          {isMobile && (
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* NAVIGATION MENU */}
        <nav className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-88px)]">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (isMobile) setOpen(false);
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ✅ SPACER - DESKTOP PAR CONTENT KO PUSH KAREGA */}
      {!isMobile && <div className="w-64" />}
    </>
  );
};

export default Sidebar;
