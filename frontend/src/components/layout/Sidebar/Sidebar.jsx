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
  Building2,
  Car,
  Menu,
  X,
  Wallet, // ADDED: Icon for Maintenance
} from "lucide-react";
import { useSocietyContext } from "../../../contexts/SocietyContext";
import { useGetSocietyRequests } from "../../../hooks/api/useRequests";
import { useMyInvitations } from "../../../hooks/api/useInvitations";
import { useGetUserAnnouncements } from "../../../hooks/api/useAnnouncements";

const adminMenu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Buildings", path: "/admin/buildings", icon: Building2 },
  { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { name: "Complaints", path: "/admin/complaints", icon: Wrench },
  { name: "Residents", path: "/admin/residents", icon: Users },
  { name: "Parking", path: "/admin/parking", icon: Car },
  { name: "Maintenance", path: "/admin/maintenance", icon: Wallet },
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
  { name: "Profile", path: "/admin/profile", icon: User },
];

const userMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Announcements", path: "/user/announcements", icon: Megaphone },
  { name: "Raise Complaint", path: "/user/raise-complaint", icon: Mail },
  { name: "Parking", path: "/user/parking", icon: Car },
  { name: "Residents", path: "/user/residents", icon: Users },
  { name: "Maintenance", path: "/user/maintenance", icon: Wallet },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile", icon: User },
];

const noSocietyMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile", icon: User },
];

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadAnnouncementsCount, setUnreadAnnouncementsCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { activeRole, activeSociety, societies, activeSocietyId } =
    useSocietyContext();
  const { data: requestsData } = useGetSocietyRequests(
    activeRole === "admin" ? activeSociety?.societyId : null
  );
  const { data: invitationsData } = useMyInvitations();
  const { data: announcements } = useGetUserAnnouncements(
    activeRole === "member" ? activeSocietyId : null
  );

  const unreadCount = requestsData?.requests?.length || 0;
  const invitationCount = invitationsData?.count || 0;

  const calculateUnreadCount = () => {
    if (announcements && activeSocietyId && activeRole === "member") {
      const storageKey = `lastSeenAnnouncements_${activeSocietyId}`;
      const lastSeenTime = localStorage.getItem(storageKey);

      if (!lastSeenTime) {
        setUnreadAnnouncementsCount(announcements.length);
      } else {
        const newCount = announcements.filter(
          (announcement) =>
            new Date(announcement.createdAt) > new Date(lastSeenTime)
        ).length;
        setUnreadAnnouncementsCount(newCount);
      }
    }
  };

  useEffect(() => {
    calculateUnreadCount();
  }, [announcements, activeSocietyId, activeRole, refreshTrigger]);

  useEffect(() => {
    const handleAnnouncementsRead = () => {
      setRefreshTrigger((prev) => prev + 1);
    };
    window.addEventListener("announcementsRead", handleAnnouncementsRead);
    return () =>
      window.removeEventListener("announcementsRead", handleAnnouncementsRead);
  }, []);

  const hasSociety = societies && societies.length > 0;
  let menu = userMenu;

  if (!hasSociety) {
    menu = noSocietyMenu;
  } else if (activeRole === "admin") {
    menu = adminMenu;
  }

  // Adjusted logic since role is 'member' in context if not 'admin'
  const isMemberRole = activeRole === "member" || activeRole === "resident";

  const getBadgeCount = (itemName) => {
    if (itemName === "Notifications") {
      return activeRole === "admin" ? unreadCount : invitationCount;
    }
    // Check if the current user is a member/resident of a society
    if (itemName === "Announcements" && isMemberRole) {
      return unreadAnnouncementsCount;
    }
    return 0;
  };

  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-0 left-0 z-50 m-2 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
        name="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          w-64 h-screen bg-gradient-to-b from-white to-gray-50 
          border-r border-gray-200 shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          overflow-y-auto
        `}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CivilCare
            </h2>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menu.map((item) => {
              const badgeCount = getBadgeCount(item.name);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <item.icon
                          className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-gray-500"
                          }`}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>

                      {badgeCount > 0 && (
                        <span className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Role Badge */}
          <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              <span className="text-sm font-semibold text-gray-700 capitalize">
                {activeRole === "admin" ? "Administrator" : "Member"}
              </span>
            </div>
            {activeSociety?.societyName && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {activeSociety.societyName}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
