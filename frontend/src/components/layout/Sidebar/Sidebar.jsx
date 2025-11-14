import React, { useEffect, useState } from "react";
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
import { useGetUserAnnouncements } from "../../../hooks/api/useAnnouncements";

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
  const { activeRole, activeSociety, societies, activeSocietyId } = useSocietyContext();

  // Fetch requests for notification badge (only for admin)
  const { data: requestsData } = useGetSocietyRequests(
    activeRole === "admin" ? activeSociety?.societyId : null
  );

  // Fetch invitations for notification badge (for users)
  const { data: invitationsData } = useMyInvitations();

  // ✅ NEW: Fetch announcements for user badge count (only for members)
  const { data: announcements } = useGetUserAnnouncements(
    activeRole === "member" ? activeSocietyId : null
  );

  const unreadCount = requestsData?.requests?.length || 0;
  const invitationCount = invitationsData?.count || 0;

  // ✅ NEW: Calculate unread announcements count
  const [unreadAnnouncementsCount, setUnreadAnnouncementsCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ Force re-calculation

  // ✅ Function to calculate unread count
  const calculateUnreadCount = () => {
    if (announcements && activeSocietyId && activeRole === "member") {
      const storageKey = `lastSeenAnnouncements_${activeSocietyId}`;
      const lastSeenTime = localStorage.getItem(storageKey);

      if (!lastSeenTime) {
        setUnreadAnnouncementsCount(announcements.length);
      } else {
        const newCount = announcements.filter(
          (announcement) => new Date(announcement.createdAt) > new Date(lastSeenTime)
        ).length;
        setUnreadAnnouncementsCount(newCount);
      }
    }
  };

  // ✅ Calculate on mount and when data changes
  useEffect(() => {
    calculateUnreadCount();
  }, [announcements, activeSocietyId, activeRole, refreshTrigger]);

  // ✅ NEW: Listen for custom event from AnnouncementPage
  useEffect(() => {
    const handleAnnouncementsRead = () => {
      // Trigger re-calculation by updating state
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('announcementsRead', handleAnnouncementsRead);

    // Cleanup
    return () => {
      window.removeEventListener('announcementsRead', handleAnnouncementsRead);
    };
  }, []);

  // ✅ Determine which menu to show
  const hasSociety = societies && societies.length > 0;
  let menu = userMenu; // Default

  if (!hasSociety) {
    menu = noSocietyMenu;
  } else if (activeRole === "admin") {
    menu = adminMenu;
  } else {
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

              {/* ✅ Notification Badge for Notifications */}
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

              {/* ✅ NEW: Notification Badge for Announcements (Users Only) */}
              {item.name === "Announcements" && 
                activeRole === "member" && 
                unreadAnnouncementsCount > 0 && (
                <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                  {unreadAnnouncementsCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
