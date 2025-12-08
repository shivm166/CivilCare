<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
=======
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
>>>>>>> 418e9e36e074f1350fa3392a7b68fdcc004047f5
import {
  LayoutDashboard,
  Megaphone,
  Wrench,
  Users,
  Bell,
  Mail,
  User,
  Building2,
<<<<<<< HEAD
=======
  ScrollText,
  Wallet,
>>>>>>> 0868b38a6f58f9f36d2df78938d99f5ad889ce05
  Car,
  X,
  Wallet,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  Receipt,
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
  {
    name: "Maintenance Rules",
    path: "/admin/maintenance-rules",
    icon: ScrollText,
  },
  { name: "Residents", path: "/admin/residents", icon: Users },
  { name: "Parking", path: "/admin/parking", icon: Car },
<<<<<<< HEAD
<<<<<<< HEAD
  { name: "Maintenance", path: "/admin/maintenance", icon: Wallet },
=======
>>>>>>> 0868b38a6f58f9f36d2df78938d99f5ad889ce05
=======
  { name: "Maintenance", path: "/admin/maintenance/rules", icon: FileText },
>>>>>>> 418e9e36e074f1350fa3392a7b68fdcc004047f5
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
  { name: "Profile", path: "/admin/profile", icon: User },
];

const userMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Announcements", path: "/user/announcements", icon: Megaphone },
<<<<<<< HEAD
<<<<<<< HEAD
  { name: "Raise Complaint", path: "/user/complaints", icon: Mail },
=======
  { name: "Raise Complaint", path: "/user/raise-complaint", icon: Mail },
>>>>>>> 418e9e36e074f1350fa3392a7b68fdcc004047f5
  { name: "Parking", path: "/user/parking", icon: Car },
=======
  { name: "Raise Complaint", path: "/user/raise-complaint", icon: Mail },
  { name: "Parking", path: "/user/parking", icon: Car }, //
>>>>>>> 0868b38a6f58f9f36d2df78938d99f5ad889ce05
  { name: "Residents", path: "/user/residents", icon: Users },
  { name: "Maintenance", path: "/user/maintenance", icon: FileText },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile", icon: User },
];

const noSocietyMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile", icon: User },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [unreadAnnouncementsCount, setUnreadAnnouncementsCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState({});

  const location = useLocation();

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

  useEffect(() => {
    const currentMenu = activeRole === "admin" ? adminMenu : userMenu;
    currentMenu.forEach((item) => {
      if (item.submenu) {
        const isActive = item.submenu.some((sub) =>
          location.pathname.startsWith(sub.path)
        );
        if (isActive) {
          setExpandedMenus((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [location.pathname, activeRole]);

  const hasSociety = societies && societies.length > 0;
  let menu = userMenu;

  if (!hasSociety) {
    menu = noSocietyMenu;
  } else if (activeRole === "admin") {
    menu = adminMenu;
  }

  const isMemberRole = activeRole === "member" || activeRole === "resident";

  const getBadgeCount = (itemName) => {
    if (itemName === "Notifications") {
      return activeRole === "admin" ? unreadCount : invitationCount;
    }
    if (itemName === "Announcements" && isMemberRole) {
      return unreadAnnouncementsCount;
    }
    return 0;
  };

  const toggleSubmenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <>
      {/* Sidebar - No overlay, just sidebar on top of content */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          w-64 h-screen bg-gradient-to-b from-white to-gray-50 
          border-r border-gray-200 shadow-2xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          overflow-y-auto
        `}
      >
        <div className="p-4 lg:p-6">
          {/* Logo with Close Button */}
          <div className="mb-4 lg:mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CivilCare
              </h2>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            {/* Close Button - Same color as open button */}
            <button
              onClick={closeMobileSidebar}
              className="lg:hidden p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menu.map((item) => {
              const badgeCount = getBadgeCount(item.name);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedMenus[item.name];

              if (hasSubmenu) {
                const isActive = item.submenu.some((sub) =>
                  location.pathname.startsWith(sub.path)
                );

                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`w-full group flex items-center justify-between px-3 py-2 lg:px-4 lg:py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                          : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <item.icon
                          className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-gray-500"
                          }`}
                        />
                        <span className="text-sm lg:text-base font-medium">{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="ml-3 lg:ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              onClick={closeMobileSidebar}
                              className={({ isActive }) =>
                                `group flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg transition-all duration-200 ${
                                  isActive
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <SubIcon
                                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                                      isActive ? "text-white" : "text-gray-500"
                                    }`}
                                  />
                                  <span className="text-xs lg:text-sm font-medium">
                                    {subItem.name}
                                  </span>
                                </>
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 lg:px-4 lg:py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <item.icon
                          className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-gray-500"
                          }`}
                        />
                        <span className="text-sm lg:text-base font-medium">{item.name}</span>
                      </div>

                      {badgeCount > 0 && (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 lg:min-w-[24px] lg:h-6 lg:px-2 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
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
          <div className="mt-4 lg:mt-8 p-3 lg:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              <span className="text-xs lg:text-sm font-semibold text-gray-700 capitalize">
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
