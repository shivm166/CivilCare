// Compressed Admin Dashboard (Under 400 lines) - Same UI + Features
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
  BarChart3,
  MessageSquare,
  Package,
  Shield,
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

const anim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};
const fade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// Small reusable UI component factories
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

const ActionCard = ({ title, desc, icon: Icon, link, color }) => (
  <motion.div variants={fade} whileHover={{ scale: 1.03, y: -3 }}>
    <Link className="group block p-5 rounded-2xl bg-white hover:border-blue-200 shadow-sm hover:shadow-xl transition-all">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 ${color} rounded-xl shadow-md group-hover:scale-110`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base">{title}</h3>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
      </div>
    </Link>
  </motion.div>
);

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

const AdminDashboard = () => {
  const { activeSocietyId } = useSocietyContext();
  const { user, loading: userLoading } = useProfile();
  const { data: complaints, isLoading: L1 } =
    useGetAllComplaints(activeSocietyId);
  const { data: announcements, isLoading: L2 } =
    useGetAdminAnnouncements(activeSocietyId);
  const { membersCount, isMembersLoading: L3 } = useMembers(activeSocietyId);
  const { data: requests, isLoading: L4 } =
    useGetSocietyRequests(activeSocietyId);

  const loading = userLoading || L1 || L2 || L3 || L4;

  const { stats, recentComplaints, recentAnnouncements } = useMemo(() => {
    const comp = Array.isArray(complaints) ? complaints : [];
    const ann = Array.isArray(announcements) ? announcements : [];
    const req = Array.isArray(requests?.requests) ? requests.requests : [];

    const pending = comp.filter((c) => c.status === "pending");
    const resolved = comp.filter((c) => c.status === "resolved");
    const progress = comp.filter((c) => c.status === "in_progress");

    return {
      stats: {
        residents: membersCount || 0,
        pending: pending.length,
        resolved: resolved.length,
        inProgress: progress.length,
        requests: req.length,
        announcements: ann.length,
        buildings: 8,
        complaints: comp.length,
      },
      recentComplaints: pending.slice(0, 4),
      recentAnnouncements: ann.slice(0, 4),
    };
  }, [complaints, announcements, membersCount, requests]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <Container className="py-8">
        <motion.div
          variants={anim}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* HEADER */}
          <motion.div
            variants={fade}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-400 bg-clip-text text-transparent">
                Hello, {user?.name?.split(" ")[0] || "Admin"}!
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </motion.div>

          {/* TOP STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Residents"
              value={stats.residents}
              icon={Users}
              link="/admin/residents"
              gradient="bg-blue-400"
            />
            <StatCard
              title="Pending Issues"
              value={stats.pending}
              icon={AlertCircle}
              link="/admin/complaints"
              gradient="bg-orange-400"
            />
            <StatCard
              title="Join Requests"
              value={stats.requests}
              icon={Bell}
              link="/admin/notifications"
              gradient="bg-pink-500"
            />
            <StatCard
              title="Announcements"
              value={stats.announcements}
              icon={Megaphone}
              link="/admin/announcements"
              gradient="bg-purple-500"
            />
          </div>

          {/* MINI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniStat
              icon={CheckCircle2}
              label="Resolved"
              value={stats.resolved}
              color="bg-green-500"
            />
            <MiniStat
              icon={Clock}
              label="In Progress"
              value={stats.inProgress}
              color="bg-amber-500"
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
              color="bg-cyan-500"
            />
            <MiniStat
              icon={Building2}
              label="Buildings"
              value={stats.buildings}
              color="bg-violet-500"
            />
          </div>

          {/* QUICK ACTIONS */}
          <div>
            <div className="flex gap-2 mb-4 items-center">
              <Zap className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-black">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard
                title="Add Resident"
                desc="Register new members"
                icon={UserPlus}
                link="/admin/residents"
                color="bg-purple-600"
              />
              <ActionCard
                title="Manage Buildings"
                desc="Update buildings"
                icon={Building2}
                color="bg-blue-600"
              />
              <ActionCard
                title="New Announcement"
                desc="Send notices"
                icon={Megaphone}
                link="/admin/announcements"
                color="bg-cyan-600"
              />
              <ActionCard
                title="View Reports"
                desc="Analytics & insights"
                icon={BarChart3}
                link="/admin/reports"
                color="bg-green-600"
              />
              <ActionCard
                title="Security"
                desc="Access & permissions"
                icon={Shield}
                color="bg-orange-600"
              />
              <ActionCard
                title="Facilities"
                desc="Manage amenities"
                icon={Package}
                color="bg-pink-600"
              />
              <ActionCard
                title="Messages"
                desc="Resident communications"
                icon={MessageSquare}
                link="/admin/messages"
                color="bg-indigo-600"
              />
              <ActionCard
                title="Complaints"
                desc="View all issues"
                icon={Wrench}
                link="/admin/complaints"
                color="bg-red-600"
              />
            </div>
          </div>

          {/* TWO COL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PENDING */}
            <motion.div
              variants={fade}
              className="bg-white/90 rounded-3xl p-6 shadow-xl border-2 border-orange-100"
            >
              <div className="flex justify-between mb-5">
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <Wrench className="text-orange-600 w-5 h-5" />
                  </div>
                  <h3 className="font-black text-xl">Pending Issues</h3>
                </div>
                <Link
                  to="/admin/complaints"
                  className="text-sm font-bold text-indigo-600 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentComplaints.length ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
                  {recentComplaints.map((c, i) => (
                    <Link
                      key={c._id || i}
                      to="/admin/complaints"
                      className="block bg-orange-50 p-4 rounded-2xl border-orange-100"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-bold text-sm line-clamp-1">
                            {c.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            By: {c.createdBy?.name || "Unknown"}
                          </p>
                        </div>
                        <span className="badge bg-orange-500 text-white text-xs">
                          Pending
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-semibold">
                    All clear! No pending issues 🎉
                  </p>
                </div>
              )}
            </motion.div>

            {/* ANNOUNCEMENTS */}
            <motion.div
              variants={fade}
              className="bg-white/90 rounded-3xl p-6 shadow-xl border-2 border-purple-100"
            >
              <div className="flex justify-between mb-5">
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Megaphone className="text-purple-600 w-5 h-5" />
                  </div>
                  <h3 className="font-black text-xl">Latest News</h3>
                </div>
                <Link
                  to="/admin/announcements"
                  className="text-sm font-bold text-indigo-600 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentAnnouncements.length ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
                  {recentAnnouncements.map((a) => (
                    <Link
                      key={a._id}
                      to="/admin/announcements"
                      className="block bg-purple-50 p-4 rounded-2xl border-purple-100"
                    >
                      <div className="flex gap-3">
                        <Star className="text-purple-500 w-5 h-5 mt-1" />
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
                    No announcements yet
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* OVERVIEW */}
          <motion.div
            variants={fade}
            className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl border-2 border-white"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-7 h-7 text-indigo-600" />
              <h3 className="text-2xl font-black">Society Overview</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Home,
                  val: stats.buildings,
                  label: "Buildings",
                  color: "from-indigo-400 to-indigo-600",
                  link: "/admin/buildings",
                },
                {
                  icon: Users,
                  val: stats.residents,
                  label: "Families",
                  color: "from-purple-400 to-purple-600",
                },
                {
                  icon: Shield,
                  val: "24/7",
                  label: "Security",
                  color: "from-pink-400 to-pink-600",
                },
                {
                  icon: Package,
                  val: 12,
                  label: "Amenities",
                  color: "from-orange-400 to-orange-600",
                },
              ].map((b, i) => (
                <Link to={b.link || "#"} key={i} className="text-center block">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${b.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}
                  >
                    <b.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-black">{b.val}</p>
                  <p className="text-sm text-gray-600 font-semibold">
                    {b.label}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* SCROLL BAR */}
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
