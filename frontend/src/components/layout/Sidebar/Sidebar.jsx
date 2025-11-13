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
import { useSocietyContext } from "../../../contexts/SocietyContext";
import { useGetSocietyRequests } from "../../../hooks/api/useRequests";
import { useMyInvitations } from "../../../hooks/api/useInvitations";

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
  { name: "Announcements", path: "/user/announcements", icon: Megaphone },
  { name: "Raise Complaint", path: "/user/raise-complaint", icon: Mail },
  { name: "Residents", path: "/user/residents", icon: Users },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile", icon: User },
];

// ✅ NEW: Menu for users without society
const noSocietyMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile", icon: User },
];

const Sidebar = () => {
  const { activeRole, activeSociety, societies } = useSocietyContext();

  // Fetch requests for notification badge (only for admin)
  const { data: requestsData } = useGetSocietyRequests(
    activeRole === "admin" ? activeSociety?.societyId : null
  );

  // Fetch invitations for notification badge (for users)
  const { data: invitationsData } = useMyInvitations();

  const unreadCount = requestsData?.requests?.length || 0;
  const invitationCount = invitationsData?.count || 0;

  // ✅ Determine which menu to show
  const hasSociety = societies && societies.length > 0;
  let menu = userMenu; // Default

  if (!hasSociety) {
    // No society: show limited menu
    menu = noSocietyMenu;
  } else if (activeRole === "admin") {
    // Has society + admin role
    menu = adminMenu;
  } else {
    // Has society + member role
    menu = userMenu;
  }

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

              {/* Notification Badge */}
              {item.name === "Notifications" && (
                <>
                  {/* Admin: Show join request count */}
                  {activeRole === "admin" && unreadCount > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}

                  {/* User: Show invitation count */}
                  {activeRole !== "admin" && invitationCount > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                      {invitationCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
