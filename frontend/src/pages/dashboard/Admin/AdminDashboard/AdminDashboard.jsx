import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  Wrench,
  Megaphone,
  Bell,
  Loader2,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  UserPlus,
  FileText,
  Settings,
  Package,
  Shield,
  BarChart3,
  MessageSquare,
  Home,
  ChevronRight,
  Zap,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../../components/layout/Container/Container";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useGetAllComplaints } from "../../../../hooks/api/useComplaints";
import { useGetAdminAnnouncements } from "../../../../hooks/api/useAnnouncements";
import { useMembers } from "../../../../hooks/api/useMembers";
import { useGetSocietyRequests } from "../../../../hooks/api/useRequests";
import useProfile from "../../../../hooks/api/auth/useProfile";

// Animations
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// Stat Card with Icon
const StatCard = ({ title, value, icon: Icon, link, gradient }) => (
  <motion.div variants={item} whileHover={{ scale: 1.05, y: -5 }}>
    <Link
      to={link}
      className={`block rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${gradient} relative overflow-hidden`}
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
      <div className="relative z-10">
        <Icon className="w-10 h-10 text-white mb-3" />
        <p className="text-white/90 text-sm font-semibold mb-1">{title}</p>
        <p className="text-5xl font-black text-white">{value}</p>
      </div>
    </Link>
  </motion.div>
);

// Quick Action Card
const ActionCard = ({ title, desc, icon: Icon, link, color }) => (
  <motion.div variants={item} whileHover={{ scale: 1.03, y: -3 }}>
    <Link
      // to={link}
      className="group block p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 ${color} rounded-xl shadow-md group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  </motion.div>
);

// Mini Stat
const MiniStat = ({ icon: Icon, label, value, color }) => (
  <motion.div
    variants={item}
    whileHover={{ scale: 1.05 }}
    className={`${color} rounded-2xl p-5 shadow-md`}
  >
    <div className="flex items-center gap-3 mb-2">
      <Icon className="w-5 h-5 text-white" />
      <span className="text-xs font-bold text-white">{label}</span>
    </div>
    <p className="text-3xl font-black text-white">{value}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const { activeSocietyId } = useSocietyContext();
  const { user, loading: userLoading } = useProfile();

  // Fetch data without society stats API (temporary)
  const { data: complaintsData, isLoading: complaintsLoading } =
    useGetAllComplaints(activeSocietyId);
  const { data: announcementsData, isLoading: announcementsLoading } =
    useGetAdminAnnouncements(activeSocietyId);
  const { membersCount, isMembersLoading } = useMembers(activeSocietyId);
  const { data: requestsData, isLoading: requestsLoading } =
    useGetSocietyRequests(activeSocietyId);

  const isLoading =
    userLoading ||
    complaintsLoading ||
    announcementsLoading ||
    isMembersLoading ||
    requestsLoading;

  const { stats, recentComplaints, recentAnnouncements } = useMemo(() => {
    // Safe array handling with fallback to empty array
    const complaintsArray = Array.isArray(complaintsData) ? complaintsData : [];
    const announcementsArray = Array.isArray(announcementsData)
      ? announcementsData
      : [];
    const requestsArray = Array.isArray(requestsData?.requests)
      ? requestsData.requests
      : [];

    const pending = complaintsArray.filter((c) => c?.status === "pending");
    const resolved = complaintsArray.filter((c) => c?.status === "resolved");
    const inProgress = complaintsArray.filter(
      (c) => c?.status === "in_progress"
    );

    return {
      stats: {
        residents: membersCount || 0,
        pending: pending.length,
        resolved: resolved.length,
        inProgress: inProgress.length,
        requests: requestsArray.length,
        announcements: announcementsArray.length,
        buildings: 8, // Default value
        complaints: complaintsArray.length,
      },
      recentComplaints: pending.slice(0, 4),
      recentAnnouncements: announcementsArray.slice(0, 4),
    };
  }, [complaintsData, announcementsData, membersCount, requestsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <Container className="py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div
            variants={item}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-400 bg-clip-text text-transparent">
                Hello, {user?.name?.split(" ")[0] || "Admin"}! 👋
              </h1>
              <p className="text-gray-500 text-sm mt-2 font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            {/* <motion.div whileHover={{ rotate: 90, scale: 1.1 }}>
              <Link
                to="/admin/settings"
                className="btn btn-circle bg-white shadow-lg border-2 border-gray-200 hover:border-indigo-300"
              >
                <Settings className="w-6 h-6 text-gray-700" />
              </Link>
            </motion.div> */}
          </motion.div>

          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Residents"
              value={stats.residents}
              icon={Users}
              link="/admin/residents"
              gradient="bg-gradient-to-br from-blue-400 to-blue-400"
            />
            <StatCard
              title="Pending Issues"
              value={stats.pending}
              icon={AlertCircle}
              link="/admin/complaints"
              gradient="bg-gradient-to-br from-orange-400 to-red-400"
            />
            <StatCard
              title="Join Requests"
              value={stats.requests}
              icon={Bell}
              link="/admin/notifications"
              gradient="bg-gradient-to-br from-pink-400 to-rose-500"
            />
            <StatCard
              title="Announcements"
              value={stats.announcements}
              icon={Megaphone}
              link="/admin/announcements"
              gradient="bg-gradient-to-br from-purple-400 to-indigo-500"
            />
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniStat
              icon={CheckCircle2}
              label="Resolved"
              value={stats.resolved}
              color="bg-gradient-to-br from-green-500 to-emerald-400"
            />
            <MiniStat
              icon={Clock}
              label="In Progress"
              value={stats.inProgress}
              color="bg-gradient-to-br from-amber-500 to-orange-400"
            />
            <MiniStat
              icon={TrendingUp}
              label="Success"
              value={
                stats.resolved > 0
                  ? `${Math.round(
                      (stats.resolved / (stats.resolved + stats.pending)) * 100
                    )}%`
                  : "0%"
              }
              color="bg-gradient-to-br from-cyan-500 to-blue-400"
            />
            <MiniStat
              icon={Building2}
              label="Buildings"
              value={stats.buildings}
              color="bg-gradient-to-br from-violet-500 to-purple-400"
            />
          </div>

          {/* Quick Actions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-black text-gray-800">
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard
                title="Add Resident"
                desc="Register new members"
                icon={UserPlus}
                link="/admin/residents"
                color="bg-gradient-to-br from-purple-500 to-purple-700"
              />
              <ActionCard
                title="Manage Buildings"
                desc="Update buildings & units"
                icon={Building2}
                link="/admin/buildings"
                color="bg-gradient-to-br from-blue-500 to-blue-700"
              />
              <ActionCard
                title="New Announcement"
                desc="Send notices"
                icon={Megaphone}
                link="/admin/announcements"
                color="bg-gradient-to-br from-cyan-500 to-cyan-700"
              />
              <ActionCard
                title="View Reports"
                desc="Analytics & insights"
                icon={BarChart3}
                link="/admin/reports"
                color="bg-gradient-to-br from-green-500 to-green-700"
              />
              <ActionCard
                title="Security"
                desc="Access & permissions"
                icon={Shield}
                // link="/admin/security"
                color="bg-gradient-to-br from-orange-500 to-orange-700"
              />
              <ActionCard
                title="Facilities"
                desc="Manage amenities"
                icon={Package}
                // link="/admin/facilities"
                color="bg-gradient-to-br from-pink-500 to-pink-700"
              />
              <ActionCard
                title="Messages"
                desc="Resident communications"
                icon={MessageSquare}
                link="/admin/messages"
                color="bg-gradient-to-br from-indigo-500 to-indigo-700"
              />
              <ActionCard
                title="Complaints"
                desc="View all issues"
                icon={Wrench}
                link="/admin/complaints"
                color="bg-gradient-to-br from-red-500 to-red-700"
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Complaints */}
            <motion.div
              variants={item}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-orange-100"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <Wrench className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-black text-xl text-gray-800">
                    Pending Issues
                  </h3>
                </div>
                <Link
                  to="/admin/complaints"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentComplaints && recentComplaints.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
                  {recentComplaints.map((item, idx) => (
                    <Link
                      key={item._id || idx}
                      to="/admin/complaints"
                      className="block bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-2xl hover:shadow-md transition-all border border-orange-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-800 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            By: {item.createdBy?.name || "Unknown"}
                          </p>
                          {item.time && (
                            <p className="text-xs text-gray-400 mt-1">
                              {item.time}
                            </p>
                          )}
                        </div>
                        <span className="badge bg-orange-500 text-white text-xs font-bold border-0 ml-2">
                          Pending
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-3 opacity-60" />
                  <p className="text-sm text-gray-600 font-semibold">
                    All clear! No pending issues 🎉
                  </p>
                </div>
              )}
            </motion.div>

            {/* Recent Announcements */}
            <motion.div
              variants={item}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-purple-100"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Megaphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-black text-xl text-gray-800">
                    Latest News
                  </h3>
                </div>
                <Link
                  to="/admin/announcements"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentAnnouncements && recentAnnouncements.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
                  {recentAnnouncements.map((item) => (
                    <Link
                      key={item._id}
                      to="/admin/announcements"
                      className="block bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-2xl hover:shadow-md transition-all border border-purple-100"
                    >
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-800 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Megaphone className="w-16 h-16 text-purple-300 mx-auto mb-3 opacity-60" />
                  <p className="text-sm text-gray-600 font-semibold">
                    No announcements yet
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Society Overview */}
          <motion.div
            variants={item}
            className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl border-2 border-white"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-7 h-7 text-indigo-600" />
              <h3 className="text-2xl font-black text-gray-800">
                Society Overview
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-black text-gray-800">
                  {stats.buildings}
                </p>
                <p className="text-sm text-gray-600 font-semibold mt-1">
                  Buildings
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-black text-gray-800">
                  {stats.residents}
                </p>
                <p className="text-sm text-gray-600 font-semibold mt-1">
                  Families
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-black text-gray-800">24/7</p>
                <p className="text-sm text-gray-600 font-semibold mt-1">
                  Security
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-black text-gray-800">12</p>
                <p className="text-sm text-gray-600 font-semibold mt-1">
                  Amenities
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #8b5cf6, #6366f1); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #7c3aed, #4f46e5); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
