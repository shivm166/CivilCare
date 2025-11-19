import {
  Bell,
  Building2,
  LayoutDashboard,
  Mail,
  Megaphone,
  User,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  { name: "Societies", path: "/super-admin/societies", icon: Building2 },
  { name: "Users", path: "/super-admin/users", icon: Users },
];

function SuperAdminSidebar() {
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
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;
