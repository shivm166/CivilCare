import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Megaphone,
  Users,
  Wrench,
  Loader2,
  CheckCircle,
  Clock,
  HelpCircle,
  Home,
  Phone,
  User,
  Bell,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../../components/layout/Container/Container";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useGetMyComplaints } from "../../../../hooks/api/useComplaints";
import { useGetUserAnnouncements } from "../../../../hooks/api/useAnnouncements";
import { useMyInvitations } from "../../../../hooks/api/useInvitations";
import { useMembers } from "../../../../hooks/api/useMembers";
import useProfile from "../../../../hooks/api/auth/useProfile";

// Helper component for complaint status badges
const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: { badge: "badge-warning", icon: <Clock className="w-4 h-4" /> },
    in_progress: {
      badge: "badge-info",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
    },
    resolved: {
      badge: "badge-success",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  };
  const { badge, icon } = statusMap[status] || {
    badge: "badge-ghost",
    icon: <HelpCircle className="w-4 h-4" />,
  };
  return (
    <div className={`badge ${badge} badge-outline gap-2 p-3 text-xs`}>
      {icon}
      {status.replace("_", " ").toUpperCase()}
    </div>
  );
};

const ResidentDashboard = () => {
  const { activeSocietyId, activeSociety } = useSocietyContext();
  const { user, loading: userLoading } = useProfile();
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

  const { myUnit, admins, stats, recentAnnouncements, recentComplaints } =
    useMemo(() => {
      const myMemberInfo = members?.find((m) => m.user?._id === user?._id);
      const pendingComplaints =
        myComplaints?.filter(
          (c) => c.status === "pending" || c.status === "in_progress"
        ).length || 0;

      return {
        myUnit: myMemberInfo?.unit || null,
        admins:
          members?.filter((m) => m.roleInSociety === "admin").slice(0, 3) || [],
        stats: {
          pendingComplaints,
          pendingInvitations: invitationsData?.count || 0,
          totalMembers: membersCount || 0,
          totalAnnouncements: announcements?.length || 0,
        },
        recentAnnouncements: announcements?.slice(0, 4) || [],
        recentComplaints: myComplaints?.slice(0, 4) || [],
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
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container className="py-6 lg:py-9">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-7 lg:space-y-10"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-base-content tracking-tight">
              Hello,{" "}
              <span className="text-primary">
                {user?.name?.split(" ")[0] || "Resident"}
              </span>{" "}
              👋
            </h1>
            <p className="mt-2 text-sm lg:text-base text-base-content/70">
              Welcome back to{" "}
              <span className="font-semibold text-primary">
                {activeSociety?.societyName || "your society"}
              </span>
              .
            </p>
          </div>
          <div className="flex items-center gap-3 self-start lg:self-auto bg-base-100 border border-base-200 rounded-2xl px-4 py-3 shadow-sm">
            <User className="w-5 h-5 text-primary" />
            <div className="text-xs">
              <p className="font-semibold text-base-content">
                {user?.name || "Resident User"}
              </p>
              <p className="text-base-content/70">
                {myUnit ? `Unit ${myUnit.unitNumber}` : "No unit linked yet"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* My Home card */}
        {myUnit && (
          <motion.div
            variants={itemVariants}
            className="card bg-primary text-primary-content shadow-lg"
          >
            <div className="card-body flex-col sm:flex-row sm:items-center sm:justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Home className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="card-title text-3xl font-extrabold">
                    Unit {myUnit.unitNumber}
                  </h2>
                  <p className="opacity-80">{activeSociety?.societyName}</p>
                </div>
              </div>
              <div className="sm:text-right mt-2 sm:mt-0">
                <div className="badge badge-outline">
                  {(myUnit.type || "apartment").replace("_", " ")}
                </div>
                {activeSociety?.city && (
                  <p className="text-sm opacity-80 mt-1">
                    {activeSociety.city}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats grid */}
        <motion.section
          variants={itemVariants}
          className="stats stats-vertical lg:stats-horizontal shadow w-full"
        >
          <div className="stat">
            <div className="stat-figure text-warning">
              <Wrench className="w-8 h-8" />
            </div>
            <div className="stat-title">Open Complaints</div>
            <div className="stat-value text-warning">
              {stats.pendingComplaints}
            </div>
            <div className="stat-actions">
              <Link
                to="/user/raise-complaint"
                className="btn btn-xs btn-outline"
              >
                View
              </Link>
            </div>
          </div>

          <div className="stat">
            <div
              className={`stat-figure ${
                stats.pendingInvitations > 0 ? "text-error" : "text-info"
              }`}
            >
              {stats.pendingInvitations > 0 ? (
                <Bell className="w-8 h-8" />
              ) : (
                <Mail className="w-8 h-8" />
              )}
            </div>
            <div className="stat-title">Notifications</div>
            <div
              className={`stat-value ${
                stats.pendingInvitations > 0 ? "text-error" : "text-info"
              }`}
            >
              {stats.pendingInvitations}
            </div>
            <div className="stat-actions">
              <Link to="/user/notifications" className="btn btn-xs btn-outline">
                Open
              </Link>
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Residents</div>
            <div className="stat-value text-info">{stats.totalMembers}</div>
            <div className="stat-actions">
              <Link to="/user/residents" className="btn btn-xs btn-outline">
                Directory
              </Link>
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <Megaphone className="w-8 h-8" />
            </div>
            <div className="stat-title">Announcements</div>
            <div className="stat-value text-success">
              {stats.totalAnnouncements}
            </div>
            <div className="stat-actions">
              <Link to="/user/announcements" className="btn btn-xs btn-outline">
                Read all
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">
          {/* Announcements */}
          <motion.div
            variants={itemVariants}
            className="card bg-base-100 shadow-md border border-base-200"
          >
            <div className="card-body">
              <div className="card-title flex items-center justify-between">
                <h3 className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" /> Latest
                  Announcements
                </h3>
                <Link
                  to="/user/announcements"
                  className="link link-primary text-xs"
                >
                  View all
                </Link>
              </div>
              {recentAnnouncements.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {recentAnnouncements.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 bg-base-200 rounded-lg hover:bg-base-300 transition"
                    >
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-base-content/50 mt-2">
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-base-content/60">
                  <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No announcements yet.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Complaints */}
          <motion.div
            variants={itemVariants}
            className="card bg-base-100 shadow-md border border-base-200"
          >
            <div className="card-body">
              <div className="card-title flex items-center justify-between">
                <h3 className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" /> My Complaints
                </h3>
                <Link
                  to="/user/raise-complaint"
                  className="link link-warning text-xs"
                >
                  Raise new
                </Link>
              </div>
              {recentComplaints.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {recentComplaints.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-base-content/50 mt-1">
                          {new Date(item.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-base-content/60">
                  <Wrench className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No complaints raised yet.</p>
                  <Link
                    to="/user/raise-complaint"
                    className="link link-primary text-xs mt-2 inline-block"
                  >
                    Raise your first complaint &rarr;
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Helpdesk */}
        <motion.div
          variants={itemVariants}
          className="card bg-base-100 shadow-md border border-base-200"
        >
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2">
              <User className="w-5 h-5 text-accent" /> Society Helpdesk
            </h3>
            <p className="text-sm text-base-content/70 mb-5">
              Reach out to your society admins for any assistance.
            </p>
            {admins.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex items-center gap-4 p-4 bg-base-200 rounded-lg"
                  >
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                        <span className="text-lg">
                          {admin.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <h4 className="font-semibold">{admin.user?.name}</h4>
                      <div className="badge badge-accent badge-outline text-xs">
                        Admin
                      </div>
                      <p className="text-xs text-base-content/70 mt-2 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {admin.user?.phone || "Not available"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-base-content/60 py-7 text-sm">
                No admin contacts available.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default ResidentDashboard;
