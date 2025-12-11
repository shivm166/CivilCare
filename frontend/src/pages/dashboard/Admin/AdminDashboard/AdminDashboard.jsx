// frontend/src/pages/dashboard/Admin/AdminDashboard/AdminDashboard.jsx
import React, { useMemo } from "react";
import {
  Users,
  Building2,
  Wrench,
  Megaphone,
  Bell,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserPlus,
  Zap,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Container from "../../../../components/layout/Container/Container";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useGetAllComplaints } from "../../../../hooks/api/useComplaints";
import { useGetAdminAnnouncements } from "../../../../hooks/api/useAnnouncements";
import { useMembers } from "../../../../hooks/api/useMembers";
import { useGetSocietyRequests } from "../../../../hooks/api/useRequests";
import useProfile from "../../../../hooks/api/auth/useProfile";
import DashboardCard from "../../../../components/features/features/dashboard/DashboardCard";

// Custom Action Card with Text Overflow Prevention
const CompactActionCard = ({ title, desc, icon: Icon, link, color }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer group hover:-translate-y-1 w-full overflow-hidden"
    >
      <div
        className={`${color} w-9 h-9 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform flex-shrink-0`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 text-xs leading-tight truncate mb-0.5">
        {title}
      </h3>
      <p className="text-[10px] text-gray-500 leading-tight truncate">{desc}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
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
    const totalComp = comp.length;

    return {
      stats: {
        residents: membersCount || 0,
        pending: pending.length,
        resolved: resolved.length,
        inProgress: totalComp - pending.length - resolved.length,
        requests: req.length,
        announcements: ann.length,
        buildings: 8,
        complaints: totalComp,
      },
      recentComplaints: pending.slice(0, 4),
      recentAnnouncements: ann
        .slice(0, 4)
        .map((a) => ({ ...a, title: a.title, description: a.description })),
    };
  }, [complaints, announcements, membersCount, requests]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-indigo-600" />
      </div>
    );

  const resolutionRate =
    stats.complaints > 0
      ? `${Math.round((stats.resolved / stats.complaints) * 100)}%`
      : "0%";

  // Card data with navigation links
  const topStatsData = [
    {
      title: "Total Residents",
      value: stats.residents,
      icon: Users,
      link: "/admin/residents",
      gradient: "bg-gradient-to-br from-blue-400 to-indigo-600",
    },
    {
      title: "Pending Issues",
      value: stats.pending,
      icon: AlertCircle,
      link: "/admin/complaints",
      gradient: "bg-gradient-to-br from-orange-400 to-red-600",
    },
    {
      title: "Join Requests",
      value: stats.requests,
      icon: Bell,
      link: "/admin/notifications",
      gradient: "bg-gradient-to-br from-pink-500 to-purple-600",
    },
    {
      title: "Announcements",
      value: stats.announcements,
      icon: Megaphone,
      link: "/admin/announcements",
      gradient: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 overflow-x-hidden">
      <Container className="py-3 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 lg:space-y-8 max-w-full">
        {/* HEADER */}
        <div className="px-1">
          <h1 className="text-xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-400 bg-clip-text text-transparent break-words">
            Hello, {user?.name?.split(" ")[0] || "Admin"}!
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* TOP STATS - 2x2 GRID ON MOBILE WITH SMALLER CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 w-full">
          {topStatsData.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.link)}
              className="cursor-pointer w-full min-w-0"
            >
              <DashboardCard type="stat" data={card} />
            </div>
          ))}
        </div>

        {/* MINI STATS - 2x2 ON MOBILE WITH COMPACT DESIGN */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
          <DashboardCard
            type="mini"
            data={{
              icon: CheckCircle2,
              label: "Resolved",
              value: stats.resolved,
              color: "bg-green-500",
            }}
          />
          <DashboardCard
            type="mini"
            data={{
              icon: Clock,
              label: "In Progress",
              value: stats.inProgress,
              color: "bg-amber-500",
            }}
          />
          <DashboardCard
            type="mini"
            data={{
              icon: TrendingUp,
              label: "Success Rate",
              value: resolutionRate,
              color: "bg-cyan-500",
            }}
          />
          <DashboardCard
            type="mini"
            data={{
              icon: Building2,
              label: "Buildings",
              value: stats.buildings,
              color: "bg-violet-500",
            }}
          />
        </div>

        {/* QUICK ACTIONS - CUSTOM COMPACT CARDS */}
        <div className="w-full">
          <div className="flex gap-2 mb-3 sm:mb-4 items-center px-1">
            <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
            <h2 className="text-base sm:text-xl lg:text-2xl font-black truncate">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
            <CompactActionCard
              title="Resident"
              desc="Add new"
              icon={UserPlus}
              link="/admin/residents"
              color="bg-purple-600"
            />
            <CompactActionCard
              title="Buildings"
              desc="Manage"
              icon={Building2}
              link="/admin/buildings"
              color="bg-blue-600"
            />
            <CompactActionCard
              title="Announce"
              desc="Send notice"
              icon={Megaphone}
              link="/admin/announcements"
              color="bg-cyan-600"
            />
            <CompactActionCard
              title="Issues"
              desc="Manage"
              icon={Wrench}
              link="/admin/complaints"
              color="bg-red-600"
            />
          </div>
        </div>

        {/* RECENT DATA - STACK ON MOBILE WITH FULL WIDTH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 w-full">
          <DashboardCard
            type="recent-items"
            data={{
              title: "Pending Issues",
              items: recentComplaints,
              itemType: "complaint",
              link: "/admin/complaints",
            }}
          />
          <DashboardCard
            type="recent-items"
            data={{
              title: "Latest News",
              items: recentAnnouncements,
              itemType: "announcement",
              link: "/admin/announcements",
            }}
          />
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
