import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Megaphone,
  Users,
  Wrench,
  ArrowRight,
  Loader2,
  CheckCircle,
  Clock,
  HelpCircle,
  Home,
  Phone,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../../components/layout/Container/Container";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useGetMyComplaints } from "../../../../hooks/api/useComplaints";
import { useGetUserAnnouncements } from "../../../../hooks/api/useAnnouncements";
import { useMyInvitations } from "../../../../hooks/api/useInvitations";
import { useMembers } from "../../../../hooks/api/useMembers";
import useProfile from "../../../../hooks/api/auth/useProfile";

// --- Reusable Components ---

const StatCard = ({ title, value, icon: Icon, color, linkTo, linkText }) => {
  const colorClasses = {
    amber: "border-amber-500 text-amber-600",
    red: "border-red-500 text-red-600",
    blue: "border-blue-500 text-blue-600",
    green: "border-green-500 text-green-600",
  };
  const aColor = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-lg border-l-4 transition-all hover:shadow-xl hover:scale-[1.02] ${aColor}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-gray-100 ${aColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <Link
          to={linkTo}
          className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          {linkText} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-600">{title}</p>
      </div>
    </div>
  );
};

// --- Status Helpers ---

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-700" />;
    case "in_progress":
      return <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />;
    case "resolved":
      return <CheckCircle className="w-4 h-4 text-green-700" />;
    default:
      return <HelpCircle className="w-4 h-4 text-gray-700" />;
  }
};

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// --- Main Dashboard Component ---

const ResidentDashboard = () => {
  const { activeSocietyId, activeSociety } = useSocietyContext();
  const { user, loading: userLoading } = useProfile();

  // --- Data Fetching ---
  const { data: myComplaints, isLoading: complaintsLoading } =
    useGetMyComplaints(activeSocietyId);
  const { data: announcements, isLoading: announcementsLoading } =
    useGetUserAnnouncements(activeSocietyId);
  const { data: invitationsData, isLoading: invitationsLoading } =
    useMyInvitations();
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

  // --- Data Processing (Memoized) ---
  const { myUnit, admins, stats, recentAnnouncements, recentComplaints } =
    useMemo(() => {
      // Find user's unit info from the members list
      const myMemberInfo = members?.find((m) => m.user?._id === user?._id);
      const myUnit = myMemberInfo?.unit || null;

      // Find society admins for helpdesk
      const admins =
        members?.filter((m) => m.roleInSociety === "admin").slice(0, 2) || [];

      // Calculate stats
      const pendingComplaints =
        myComplaints?.filter(
          (c) => c.status === "pending" || c.status === "in_progress"
        ).length || 0;
      const pendingInvitations = invitationsData?.count || 0;

      const stats = {
        pendingComplaints,
        pendingInvitations,
        totalMembers: membersCount || 0,
        totalAnnouncements: announcements?.length || 0,
      };

      // Get recent items
      const recentAnnouncements = announcements?.slice(0, 3) || [];
      const recentComplaints = myComplaints?.slice(0, 3) || [];

      return {
        myUnit,
        admins,
        stats,
        recentAnnouncements,
        recentComplaints,
      };
    }, [
      members,
      user,
      myComplaints,
      invitationsData,
      membersCount,
      announcements,
    ]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* --- Welcome Header --- */}
        <motion.div variants={sectionVariants}>
          <h2 className="text-3xl font-bold text-slate-800">
            Welcome, {user?.name || "Resident"}!
          </h2>
          <p className="text-lg text-slate-600 mt-1">
            You are viewing the dashboard for{" "}
            <span className="font-semibold text-indigo-600">
              {activeSociety?.societyName || "your society"}
            </span>
            .
          </p>
        </motion.div>

        {/* --- My Home Card --- */}
        {myUnit && (
          <motion.div
            variants={sectionVariants}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <Home className="w-10 h-10" />
              <div>
                <p className="text-indigo-200">My Home</p>
                <h3 className="text-4xl font-bold">Unit {myUnit.unitNumber}</h3>
              </div>
            </div>
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full capitalize">
              {myUnit.type.replace("_", " ")}
            </span>
          </motion.div>
        )}

        {/* --- Society Overview (Stats) --- */}
        <motion.div variants={sectionVariants}>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Society Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="My Open Complaints"
              value={stats.pendingComplaints}
              icon={Wrench}
              color="amber"
              linkTo="/user/raise-complaint"
              linkText="Manage"
            />
            <StatCard
              title=" Notfications"
              value={stats.pendingInvitations}
              icon={Mail}
              color="red"
              linkTo="/user/notifications"
              linkText="View"
            />
            <StatCard
              title="Total Residents"
              value={stats.totalMembers}
              icon={Users}
              color="blue"
              linkTo="/user/residents"
              linkText="Directory"
            />
            <StatCard
              title="Announcements"
              value={stats.totalAnnouncements}
              icon={Megaphone}
              color="green"
              linkTo="/user/announcements"
              linkText="Read"
            />
          </div>
        </motion.div>

        {/* --- Recent Activity Section --- */}
        <motion.div
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Recent Announcements */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Recent Announcements
            </h3>
            {recentAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {recentAnnouncements.map((item) => (
                  <div key={item._id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-slate-800 truncate">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">
                No recent announcements.
              </p>
            )}
          </div>

          {/* My Complaint Status */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              My Complaint Status
            </h3>
            {recentComplaints.length > 0 ? (
              <div className="space-y-4">
                {recentComplaints.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-800 truncate">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">
                You haven't raised any complaints.
              </p>
            )}
          </div>
        </motion.div>

        {/* --- Helpdesk --- */}
        <motion.div
          variants={sectionVariants}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Society Helpdesk
          </h3>
          <p className="text-slate-600 mb-4">
            Need help? Contact your society administrators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <div
                  key={admin._id}
                  className="p-4 bg-gray-50 rounded-lg flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {admin.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {admin.user?.name}
                    </h4>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      Admin
                    </span>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                      <Phone className="w-3 h-3" /> {admin.user?.phone}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No administrator contacts found.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default ResidentDashboard;
