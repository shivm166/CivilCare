import { Bell, LayoutDashboard, Mail, Megaphone, User, Users } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom'

const menu = [
  { name: "Dashboard", path: "/superadmin/dashboard", icon: LayoutDashboard },
  { name: "Raise Complaint", path: "/superadmin/raise-complaint", icon: Mail },
  { name: "Announcements", path: "/superadmin/announcements", icon: Megaphone },
  { name: "Residents", path: "/superadmin/residents", icon: Users },
  { name: "Notifications", path: "/superadmin/notifications", icon: Bell },
];

function SuperAdminSidebar() {
  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4 sticky top-0 hidden md:block flex-shrink-0">
      <nav className="space-y-2">
        <p className="text-xs font-semibold uppercase text-gray-500 mb-4">
          Super Admin Panel
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
          to={""}
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
  )
}

export default SuperAdminSidebar