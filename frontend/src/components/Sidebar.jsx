import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Wrench,
  Users,
  Bell,
  Mail,
  User,
  Menu, // Hamburger icon for open
  X, // Close icon for cancel
} from "lucide-react";
import { useSocietyContext } from "../context/SocietyContext";
import { useGetSocietyRequests } from "../hooks/useRequests";

// Define the menu configurations
const adminMenu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { name: "Complaints", path: "/admin/complaints", icon: Wrench },
  { name: "Residents", path: "/admin/residents", icon: Users },
  { name: "Notifications", path: "/admin/notifications", icon: Bell }, // ⬅️ Only ONE Notifications with badge
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
  const { activeRole, activeSociety } = useSocietyContext();
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar open/closed

  // Fetch requests for notification badge (only for admin)
  const { data: requestsData } = useGetSocietyRequests(
    activeRole === "admin" ? activeSociety?.societyId : null
  );

  const unreadCount = requestsData?.requests?.length || 0;

  const menu = activeRole === "admin" ? adminMenu : userMenu;

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 overflow-hidden transition-all duration-300 ${
        isOpen ? "w-64" : "w-12"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Icon - Only one visible at a time, bigger when closed */}
        {!isOpen && (
          <div className="flex justify-center items-center p-4">
            <Menu
              onClick={() => setIsOpen(true)}
              className="w-8 h-8 cursor-pointer text-gray-600 hover:text-indigo-600 transition-colors"
            />
          </div>
        )}

        {/* Menu content only shown when open */}
        {isOpen && (
          <div className="flex-1 p-6 pt-0">
            {/* Header with CivilCare and Cancel Icon on the same line, moved slightly lower */}
            <div className="flex items-center justify-between mb-8 mt-4">
              <h2 className="text-2xl font-bold text-indigo-600">CivilCare</h2>
              <X
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 cursor-pointer text-gray-600 hover:text-indigo-600 transition-colors"
              />
            </div>
            <nav className="space-y-2">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>

                  {/* Notification Badge - Only on Notifications item for admin */}
                  {item.name === "Notifications" &&
                    activeRole === "admin" &&
                    unreadCount > 0 && (
                      <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
