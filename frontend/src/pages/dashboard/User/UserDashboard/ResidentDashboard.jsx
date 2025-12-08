import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Megaphone,
  Users,
  Wrench,
  Loader2,
  User,
  Bell,
  AlertCircle,
  ChevronRight,
  Phone,
  Mail,
  Home,
  Clock,
  MapPin,
  Calendar,
  Shield,
  Building2,
} from "lucide-react";
import Container from "../../../../components/layout/Container/Container";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useGetMyComplaints } from "../../../../hooks/api/useComplaints";
import { useGetUserAnnouncements } from "../../../../hooks/api/useAnnouncements";
import { useMyInvitations } from "../../../../hooks/api/useInvitations";
import { useMembers } from "../../../../hooks/api/useMembers";
import useProfile from "../../../../hooks/api/auth/useProfile";
import Card from "../../../../components/common/Card/Card";
import StatusBadge from "../../../../components/common/StatusBadge/StatusBadge";

// Perfectly sized StatCard - Ultra compact for mobile
const StatCard = ({ title, value, Icon, to, gradientFrom, gradientTo }) => (
  <Link
    to={to}
    className={`group relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
  >
    <div className="absolute inset-0 bg-white/5" />
    <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
    
    <div className="relative">
      <div className="flex items-start justify-between mb-1.5">
        <div className="p-1 sm:p-1.5 bg-white/20 rounded-md sm:rounded-lg shadow-sm">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-[9px] sm:text-[10px] font-semibold text-white/90 mb-0.5">{title}</p>
      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
        {typeof value === "number" ? value : value ?? 0}
      </p>
    </div>
  </Link>
);

// Ultra compact AdminCard
const AdminCard = ({ admin }) => {
  const name = admin.user?.name || "Admin";
  const phone = admin.user?.phone || null;
  const email = admin.user?.email || null;
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
            {initials}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[11px] sm:text-xs text-gray-900 truncate">{name}</h4>
          <div className="flex items-center gap-0.5 mt-0.5">
            <Shield className="w-2.5 h-2.5 text-indigo-600" />
            <span className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase">Admin</span>
          </div>
        </div>
      </div>

      {phone && (
        <div className="mb-2 px-2 py-1.5 bg-gray-50 rounded-md">
          <p className="text-[8px] text-gray-500 font-medium mb-0.5">Contact</p>
          <p className="text-[10px] sm:text-[11px] text-gray-900 font-semibold truncate">{phone}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] sm:text-[10px] font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
          >
            <Phone className="w-2.5 h-2.5" />
            <span>Call</span>
          </a>
        ) : (
          <button className="flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] sm:text-[10px] font-bold bg-gray-100 text-gray-400 rounded-md cursor-not-allowed">
            <Phone className="w-2.5 h-2.5" />
            <span>Call</span>
          </button>
        )}

        {email ? (
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] sm:text-[10px] font-bold bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all shadow-sm active:scale-95"
          >
            <Mail className="w-2.5 h-2.5" />
            <span>Email</span>
          </a>
        ) : (
          <button className="flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] sm:text-[10px] font-bold bg-gray-100 text-gray-400 rounded-md cursor-not-allowed">
            <Mail className="w-2.5 h-2.5" />
            <span>Email</span>
          </button>
        )}
      </div>
    </div>
  );
};

const ResidentDashboard = () => {
  const { activeSocietyId, activeSociety } = useSocietyContext();
  const { user, loading: userLoading } = useProfile();
  const { data: myComplaintsData, isLoading: complaintsLoading } =
    useGetMyComplaints(activeSocietyId, { enabled: !!activeSocietyId });
  const { data: announcementsData, isLoading: announcementsLoading } =
    useGetUserAnnouncements(activeSocietyId);
  const { data: invitationsData, isLoading: invitationsLoading } =
    useMyInvitations();
  const {
    members = [],
    membersCount = 0,
    isMembersLoading: membersLoading,
  } = useMembers(activeSocietyId);

  const isLoading =
    userLoading ||
    complaintsLoading ||
    announcementsLoading ||
    invitationsLoading ||
    membersLoading;

  const { myUnit, admins, stats, recentAnnouncements, recentComplaints } =
    useMemo(() => {
      const complaints = Array.isArray(myComplaintsData?.data)
        ? myComplaintsData.data
        : Array.isArray(myComplaintsData)
        ? myComplaintsData
        : [];
      const announcements = Array.isArray(announcementsData?.data)
        ? announcementsData.data
        : Array.isArray(announcementsData)
        ? announcementsData
        : [];
      const invitationsCount =
        invitationsData?.count ?? invitationsData?.pending ?? 0;
      const member =
        members.find((m) => String(m.user?._id) === String(user?._id)) || null;
      const activeComplaints = complaints.filter((c) => {
        const s = String(c?.status ?? "")
          .toLowerCase()
          .replace(/[-_\s]+/g, "_");
        return [
          "pending",
          "in_progress",
          "in-progress",
          "open",
          "inprogress",
        ].includes(s);
      });

      return {
        myUnit: member?.unit ?? null,
        admins: (members || [])
          .filter((m) => m.roleInSociety === "admin")
          .slice(0, 6),
        stats: {
          pendingComplaints: activeComplaints.length,
          pendingInvitations: invitationsCount,
          totalMembers: membersCount || members.length,
          totalAnnouncements: announcements.length,
        },
        recentAnnouncements: announcements.slice(0, 3),
        recentComplaints: complaints.slice(0, 3),
      };
    }, [
      members,
      user,
      myComplaintsData,
      invitationsData,
      membersCount,
      announcementsData,
    ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Container className="py-2.5 sm:py-3 lg:py-4 px-2.5 sm:px-3 lg:px-4">
        <div className="max-w-7xl mx-auto space-y-2.5 sm:space-y-3 lg:space-y-4">
          
          {/* Ultra compact Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-3 sm:p-4 shadow-lg">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZWMjRoNnYtNmg2djZoNnY2aC02djZoLTZ2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
            
            <div className="relative flex items-center justify-between gap-2.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/80" />
                  <p className="text-[9px] sm:text-[10px] font-semibold text-white/90 truncate">
                    {activeSociety?.societyName || "Your Society"}
                  </p>
                </div>
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1">
                  Welcome, {user?.name?.split(" ")[0] || "Resident"}!
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px]">
                  <div className="flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    <span className="sm:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  {myUnit && (
                    <>
                      <span className="text-white/40">•</span>
                      <div className="flex items-center gap-0.5">
                        <Home className="w-2.5 h-2.5" />
                        <span>Unit {myUnit.name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-lg lg:rounded-xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Perfect Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
            <StatCard
              title="Members"
              value={stats.totalMembers}
              Icon={Users}
              to="/user/residents"
              gradientFrom="from-blue-500"
              gradientTo="to-cyan-600"
            />
            <StatCard
              title="Issues"
              value={stats.pendingComplaints}
              Icon={AlertCircle}
              to="/user/raise-complaint"
              gradientFrom="from-orange-500"
              gradientTo="to-red-600"
            />
            <StatCard
              title="Invites"
              value={stats.pendingInvitations}
              Icon={Bell}
              to="/user/notifications"
              gradientFrom="from-pink-500"
              gradientTo="to-rose-600"
            />
            <StatCard
              title="News"
              value={stats.totalAnnouncements}
              Icon={Megaphone}
              to="/user/announcements"
              gradientFrom="from-emerald-500"
              gradientTo="to-teal-600"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2.5 sm:gap-3">
            
            {/* Left & Middle Column */}
            <div className="xl:col-span-2 space-y-2.5 sm:space-y-3">
              
              {/* Recent Issues - Ultra compact */}
              <Card className="border-0 shadow-lg bg-white">
                <div className="p-2.5 sm:p-3 lg:p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-md">
                        <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">Recent Issues</h3>
                        <p className="text-[9px] text-gray-500 hidden sm:block">Your complaints</p>
                      </div>
                    </div>
                    <Link
                      to="/user/raise-complaint"
                      className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors px-1.5 py-1 rounded-md hover:bg-indigo-50"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>

                  {recentComplaints.length > 0 ? (
                    <div className="space-y-2">
                      {recentComplaints.map((c, i) => (
                        <Link
                          key={c._id || i}
                          to="/user/raise-complaint"
                          className="block group"
                        >
                          <div className="bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-lg p-2 sm:p-2.5 border border-orange-200 transition-all duration-200 hover:shadow-md">
                            <div className="flex gap-2">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-sm group-hover:scale-105 transition-transform">
                                  {(c.title || "!").charAt(0).toUpperCase()}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1 mb-0.5">
                                  <h4 className="font-bold text-[11px] sm:text-xs text-gray-900 line-clamp-1 flex-1">
                                    {c.title || "Untitled"}
                                  </h4>
                                  <span className="flex-shrink-0 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-200 text-orange-900 uppercase">
                                    {c.priority || "N/A"}
                                  </span>
                                </div>

                                <p className="text-[9px] sm:text-[10px] text-gray-600 line-clamp-1 mb-1">
                                  {c.description || "No description"}
                                </p>

                                <div className="flex items-center flex-wrap gap-1 text-[8px] sm:text-[9px]">
                                  <StatusBadge type={c.status} compact />
                                  <span className="text-gray-300 hidden sm:inline">•</span>
                                  <div className="flex items-center gap-0.5 text-gray-500">
                                    <Clock className="w-2 h-2" />
                                    <span>
                                      {new Date(c.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                  {(c?.unit || myUnit) && (
                                    <>
                                      <span className="text-gray-300 hidden sm:inline">•</span>
                                      <div className="flex items-center gap-0.5 text-gray-500">
                                        <Home className="w-2 h-2" />
                                        <span className="truncate max-w-[60px] sm:max-w-none">
                                          {c?.unit ? `Unit ${c.unit?.name || c.unit}` : "My Unit"}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                        <Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-600 font-semibold mb-0.5">No issues reported</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500">Everything looks good!</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Latest News - Ultra compact */}
              <Card className="border-0 shadow-lg bg-white">
                <div className="p-2.5 sm:p-3 lg:p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
                        <Megaphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">Latest News</h3>
                        <p className="text-[9px] text-gray-500 hidden sm:block">Announcements</p>
                      </div>
                    </div>
                    <Link
                      to="/user/announcements"
                      className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors px-1.5 py-1 rounded-md hover:bg-indigo-50"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>

                  {recentAnnouncements.length > 0 ? (
                    <div className="space-y-2">
                      {recentAnnouncements.map((a) => (
                        <Link
                          key={a._id}
                          to="/user/announcements"
                          className="block group"
                        >
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg p-2 sm:p-2.5 border border-purple-200 transition-all duration-200 hover:shadow-md">
                            <div className="flex gap-2">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-sm group-hover:scale-105 transition-transform">
                                  {(a.title || "?").charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[11px] sm:text-xs text-gray-900 mb-0.5 line-clamp-1">
                                  {a.title || "Untitled"}
                                </h4>
                                <p className="text-[9px] sm:text-[10px] text-gray-600 line-clamp-2">
                                  {a.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                        <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-600 font-semibold mb-0.5">No announcements</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500">Check back later</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column - Helpdesk */}
            <div className="xl:col-span-1">
              <div className="xl:sticky xl:top-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                  <div className="p-2.5 sm:p-3 lg:p-4">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md">
                        <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">Helpdesk</h3>
                        <p className="text-[9px] text-gray-600 hidden sm:block">Contact admins</p>
                      </div>
                    </div>

                    {admins.length > 0 ? (
                      <div className="space-y-2">
                        {admins.map((admin) => (
                          <AdminCard key={admin._id} admin={admin} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-1.5">
                          <Users className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-600 font-semibold mb-0.5">No administrators</p>
                        <p className="text-[9px] sm:text-[10px] text-gray-500">Contact management</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ResidentDashboard;