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

// Define the menu configurations
const adminMenu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { name: "Complaints", path: "/admin/complaints", icon: Wrench },
  { name: "Residents", path: "/admin/residents", icon: Users },
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
  { name: "Profile", path: "/admin/profile", icon: User },
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
  const { activeRole } = useSocietyContext();
  const menu = activeRole === "admin" ? adminMenu : userMenu;

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4 sticky top-0 hidden md:block flex-shrink-0">
      <nav className="space-y-2">
        <p className="text-xs font-semibold uppercase text-gray-500 mb-4">
          {activeRole === "admin" ? "Admin Panel" : "User Panel"}
        </p>
        {menu.map((item) => (
          <NavLink
            key={item.name}
            // All paths are dynamically prefixed with the active role for correct URL routing
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-gray-700 
               ${
                 isActive
                   ? "bg-emerald-100 text-emerald-700 font-semibold"
                   : "hover:bg-gray-100"
               }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Profile Option for all roles */}
        <NavLink
          to={`/${activeRole === "member" ? "user" : activeRole}/profile`}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-gray-700 
               ${
                 isActive
                   ? "bg-emerald-100 text-emerald-700 font-semibold"
                   : "hover:bg-gray-100"
               }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
