import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Wrench,
  Users,
  Bell,
  Mail,
  User,
} from "lucide-react";
import { useSocietyContext } from "../context/SocietyContext";
import { useGetSocietyRequests } from "../hooks/useRequests"; // ⬅️ ADD THIS

// Define the menu configurations
const adminMenu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { name: "Complaints", path: "/admin/complaints", icon: Wrench },
  { name: "Residents", path: "/admin/residents", icon: Users },
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
  { name: "Profile", path: "/admin/profile", icon: User },
  { name: "Notifications", path: "/admin/notifications", icon: Bell }, // ⬅️ This will have badge
];

const userMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Raise Complaint", path: "/user/raise-complaint", icon: Mail },
  { name: "Announcements", path: "/user/announcements", icon: Megaphone },
  { name: "Residents", path: "/user/residents", icon: Users },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile", icon: User },
];

const Sidebar = () => {
  const { activeRole, activeSociety } = useSocietyContext();

  // ⬅️ Fetch requests for notification badge (only for admin)
  const { data: requestsData } = useGetSocietyRequests(
    activeRole === "admin" ? activeSociety?.societyId : null
  );

  const unreadCount = requestsData?.requests?.length || 0;

  const menu = activeRole === "admin" ? adminMenu : userMenu;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">CivilCare</h2>
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

              {/* ⬅️ ADD NOTIFICATION BADGE */}
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

      {/* User Profile Section */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500 capitalize">{activeRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
