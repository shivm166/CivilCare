// frontend/src/pages/dashboard/User/UserDashboard/ResidentDashboard.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Megaphone,
  Users,
  Wrench,
  Loader2,
  CheckCircle2,
  Clock,
  Home,
  Phone,
  User,
  Bell,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../../components/layout/Container/Container";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useGetMyComplaints } from "../../../../hooks/api/useComplaints";
import { useGetUserAnnouncements } from "../../../../hooks/api/useAnnouncements";
import { useMyInvitations } from "../../../../hooks/api/useInvitations";
import { useMembers } from "../../../../hooks/api/useMembers";
import useProfile from "../../../../hooks/api/auth/useProfile";
import Card from "../../../../components/common/Card/Card"; // 💡 NEW IMPORT
import StatusBadge from "../../../../components/common/StatusBadge/StatusBadge"; // 💡 NEW IMPORT

// Animation Variants (from AdminDashboard.jsx)
const anim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};
const fade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// 💡 REFACTORED: StatCard now uses the generic Card component
const StatCard = ({ title, value, icon: Icon, link, gradient }) => (
  <motion.div variants={fade} whileHover={{ scale: 1.05, y: -5 }}>
    <Link
      to={link}
      className={`block rounded-3xl p-6 shadow-xl ${gradient} relative overflow-hidden`}
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

// 💡 REFACTORED: ActionCard now uses the generic Card component
const ActionCard = ({ title, desc, icon: Icon, link, color }) => (
  <motion.div variants={fade} whileHover={{ scale: 1.03, y: -3 }}>
    <Link to={link} className="group block">
      <Card className="hover:border-blue-200 hover:shadow-xl">
        <div className="flex items-center gap-4 p-0">
          <div
            className={`p-3 ${color} rounded-xl shadow-md group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
        </div>
      </Card>
    </Link>
  </motion.div>
);

// 💡 REFACTORED: MiniStat now uses the generic Card component
const MiniStat = ({ icon: Icon, label, value, color }) => (
  <motion.div
    variants={fade}
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

const ResidentDashboard = () => {
  const { activeSocietyId, activeSociety } = useSocietyContext();
  const { user, loading: userLoading } = useProfile();
  // Fetch user's own complaints
  const { data: myComplaintsData, isLoading: complaintsLoading } =
    useGetMyComplaints(activeSocietyId);
  // Fetch user announcements
  const { data: announcementsData, isLoading: announcementsLoading } =
    useGetUserAnnouncements(activeSocietyId);
  // Fetch user's invitations (for notification count)
  const { data: invitationsData, isLoading: invitationsLoading } =
    useMyInvitations();
  // Fetch all members to get count and admins
  const {
    members,
    membersCount,
    isMembersLoading: membersLoading,
  } = useMembers(activeSocietyId);

  const isLoading =
    userLoading ||
    complaintsLoading ||
    announcementsLoading ||
    invitationsLoading ||
    membersLoading;

  const {
    myUnit,
    admins,
    stats,
    recentAnnouncements,
    recentComplaints,
    complaintStats,
  } = useMemo(() => {
    const myComplaints = myComplaintsData?.data || [];
    const announcements = announcementsData || [];
    const myMemberInfo = members?.find((m) => m.user?._id === user?._id);

    const pending = myComplaints.filter((c) => c.status === "pending");
    const inProgress = myComplaints.filter((c) => c.status === "in_progress");
    const resolved = myComplaints.filter((c) => c.status === "resolved");

    const totalComplaints = myComplaints.length;
    const totalActiveComplaints = pending.length + inProgress.length;

    const resolutionRate =
      totalComplaints > 0
        ? `${Math.round((resolved.length / totalComplaints) * 100)}%`
        : "0%";

    return {
      myUnit: myMemberInfo?.unit || null,
      admins:
        members?.filter((m) => m.roleInSociety === "admin").slice(0, 3) || [],
      stats: {
        pendingComplaints: totalActiveComplaints,
        pendingInvitations: invitationsData?.count || 0,
        totalMembers: membersCount || 0,
        totalAnnouncements: announcements.length || 0,
        totalComplaints,
      },
      complaintStats: {
        resolved: resolved.length,
        inProgress: inProgress.length,
        resolutionRate,
      },
      recentAnnouncements: announcements.slice(0, 4) || [],
      recentComplaints: myComplaints.slice(0, 4) || [],
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
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    // Adapted background from AdminDashboard.jsx
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <Container className="py-6 lg:py-9">
        <motion.div
          initial="hidden"
          animate="show"
          variants={anim}
          className="space-y-7 lg:space-y-10"
        >
          {/* HEADER (Adapted from AdminDashboard.jsx) */}
          <motion.div
            variants={fade}
            className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-400 bg-clip-text text-transparent">
                Hello, {user?.name?.split(" ")[0] || "Resident"}!
              </h1>
              <p className="mt-2 text-sm lg:text-base text-gray-500">
                Welcome to{" "}
                <span className="font-semibold text-indigo-600">
                  {activeSociety?.societyName || "your society"}
                </span>{" "}
                Dashboard.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            {/* User/Unit Tag (Moved from old dash to here) */}
            <Card className="shadow-md bg-white border border-gray-200">
              <div className="flex items-center gap-3 self-start lg:self-auto p-0">
                <User className="w-5 h-5 text-indigo-600" />
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">
                    {user?.name || "Resident User"}
                  </p>
                  <p className="text-gray-600">
                    {myUnit ? `Unit ${myUnit.name}` : "No unit linked yet"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* TOP STATS (Adapted StatCard design) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Members"
              value={stats.totalMembers}
              icon={Users}
              link="/user/residents"
              gradient="bg-gradient-to-br from-blue-600 to-cyan-600"
            />
            <StatCard
              title="Open Complaints"
              value={stats.pendingComplaints}
              icon={AlertCircle}
              link="/user/raise-complaint"
              gradient="bg-gradient-to-br from-orange-500 to-red-600"
            />
            <StatCard
              title="New Invitations"
              value={stats.pendingInvitations}
              icon={Bell}
              link="/user/notifications"
              gradient="bg-gradient-to-br from-pink-500 to-purple-600"
            />
            <StatCard
              title="Announcements"
              value={stats.totalAnnouncements}
              icon={Megaphone}
              link="/user/announcements"
              gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            />
          </div>

          {/* MINI STATS (Adapted MiniStat design) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniStat
              icon={Home}
              label="My Unit"
              value={myUnit?.name || "N/A"}
              color="bg-gradient-to-r from-indigo-500 to-blue-500"
            />
            <MiniStat
              icon={CheckCircle2}
              label="Resolved"
              value={complaintStats.resolved}
              color="bg-gradient-to-r from-green-500 to-teal-500"
            />
            <MiniStat
              icon={Clock}
              label="In Progress"
              value={complaintStats.inProgress}
              color="bg-gradient-to-r from-amber-500 to-orange-500"
            />
            <MiniStat
              icon={TrendingUp}
              label="Resolution Rate"
              value={complaintStats.resolutionRate}
              color="bg-gradient-to-r from-cyan-500 to-purple-500"
            />
          </div>

          {/* QUICK ACTIONS (Adapted ActionCard design) */}
          <div>
            <div className="flex gap-2 mb-4 items-center">
              <Zap className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-black">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard
                title="Raise Complaint"
                desc="Report issues instantly"
                icon={Wrench}
                link="/user/raise-complaint"
                color="bg-red-600"
              />
              <ActionCard
                title="Read Notices"
                desc="View all society announcements"
                icon={Megaphone}
                link="/user/announcements"
                color="bg-purple-600"
              />
              <ActionCard
                title="Society Directory"
                desc="Find contacts and units"
                icon={Users}
                link="/user/residents"
                color="bg-blue-600"
              />
              <ActionCard
                title="My Profile"
                desc="Update personal details"
                icon={User}
                link="/user/profile"
                color="bg-green-600"
              />
            </div>
          </div>

          {/* TWO COL - Complaints & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Complaints */}
            <motion.div variants={fade}>
              <Card className="h-full border-2 border-orange-100 p-0">
                <div className="p-6">
                  <div className="flex justify-between mb-5">
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-orange-100 rounded-xl">
                        <Wrench className="text-orange-600 w-5 h-5" />
                      </div>
                      <h3 className="font-black text-xl">My Recent Issues</h3>
                    </div>
                    <Link
                      to="/user/raise-complaint"
                      className="text-sm font-bold text-indigo-600 flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {recentComplaints.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
                      {recentComplaints.map((c, i) => (
                        <Link
                          key={c._id || i}
                          to="/user/raise-complaint"
                          className="block bg-orange-50 p-4 rounded-2xl border-orange-100 hover:bg-orange-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm line-clamp-1">
                                {c.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Priority:{" "}
                                <StatusBadge
                                  type={c.priority}
                                  compact
                                  className="ml-1"
                                />
                              </p>
                            </div>
                            <StatusBadge type={c.status} compact />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Wrench className="w-16 h-16 text-orange-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 font-semibold">
                        No complaints raised yet.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Announcements */}
            <motion.div variants={fade}>
              <Card className="h-full border-2 border-purple-100 p-0">
                <div className="p-6">
                  <div className="flex justify-between mb-5">
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <Megaphone className="text-purple-600 w-5 h-5" />
                      </div>
                      <h3 className="font-black text-xl">Latest News</h3>
                    </div>
                    <Link
                      to="/user/announcements"
                      className="text-sm font-bold text-indigo-600 flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {recentAnnouncements.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
                      {recentAnnouncements.map((a) => (
                        <Link
                          key={a._id}
                          to="/user/announcements"
                          className="block bg-purple-50 p-4 rounded-2xl border-purple-100 hover:bg-purple-100 transition-colors"
                        >
                          <div className="flex gap-3">
                            <Megaphone className="text-purple-500 w-5 h-5 mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-sm line-clamp-1">
                                {a.title}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {a.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Megaphone className="w-16 h-16 text-purple-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 font-semibold">
                        No announcements available.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* HELPDESK */}
          <motion.div variants={fade}>
            <Card className="p-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-2 border-white">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Phone className="w-7 h-7 text-indigo-600" />
                  <h3 className="text-2xl font-black">Society Helpdesk</h3>
                </div>
                <p className="text-gray-700 mb-5">
                  Contact your society administrators or view the resident
                  directory.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {admins.map((admin) => (
                    <div
                      key={admin._id}
                      className="flex flex-col items-center gap-2 p-4 bg-white/50 rounded-xl border border-indigo-200 backdrop-blur-sm"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {admin.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-gray-900 line-clamp-1">
                          {admin.user?.name}
                        </h4>
                        <span className="text-xs font-semibold text-purple-600">
                          ADMIN
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{admin.user?.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="line-clamp-1">
                          {admin.user?.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {admins.length === 0 && (
                  <div className="text-center py-5">
                    <p className="text-sm text-gray-600">
                      No administrators found.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default ResidentDashboard;
