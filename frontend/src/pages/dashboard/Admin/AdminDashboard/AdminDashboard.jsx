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
import Container from "../../../../components/layout/Container/Container";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useGetAllComplaints } from "../../../../hooks/api/useComplaints";
import { useGetAdminAnnouncements } from "../../../../hooks/api/useAnnouncements";
import { useMembers } from "../../../../hooks/api/useMembers";
import { useGetSocietyRequests } from "../../../../hooks/api/useRequests";
import useProfile from "../../../../hooks/api/auth/useProfile";
import DashboardCard from "../../../../components/features/features/dashboard/DashboardCard";

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
    const totalComp = comp.length;

    return {
      stats: {
        residents: membersCount || 0,
        pending: pending.length,
        resolved: resolved.length,
        inProgress: totalComp - pending.length - resolved.length,
        requests: req.length,
        announcements: ann.length,
        buildings: 8, // Mock data
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
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
      </div>
    );

  const resolutionRate =
    stats.complaints > 0
      ? `${Math.round((stats.resolved / stats.complaints) * 100)}%`
      : "0%";

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <Container className="py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 lg:space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-400 bg-clip-text text-transparent">
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

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            type="stat"
            data={{
              title: "Total Residents",
              value: stats.residents,
              icon: Users,
              link: "/admin/residents",
              gradient: "bg-gradient-to-br from-blue-400 to-indigo-600",
            }}
          />
          <DashboardCard
            type="stat"
            data={{
              title: "Pending Issues",
              value: stats.pending,
              icon: AlertCircle,
              link: "/admin/complaints",
              gradient: "bg-gradient-to-br from-orange-400 to-red-600",
            }}
          />
          <DashboardCard
            type="stat"
            data={{
              title: "Join Requests",
              value: stats.requests,
              icon: Bell,
              link: "/admin/notifications",
              gradient: "bg-gradient-to-br from-pink-500 to-purple-600",
            }}
          />
          <DashboardCard
            type="stat"
            data={{
              title: "Announcements",
              value: stats.announcements,
              icon: Megaphone,
              link: "/admin/announcements",
              gradient: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
            }}
          />
        </div>

        {/* MINI STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* QUICK ACTIONS */}
        <div>
          <div className="flex gap-2 mb-4 items-center">
            <Zap className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-black">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard
              type="action"
              data={{
                title: "Add Resident",
                desc: "Register new members",
                icon: UserPlus,
                link: "/admin/residents",
                color: "bg-purple-600",
              }}
            />
            <DashboardCard
              type="action"
              data={{
                title: "Manage Buildings",
                desc: "View/add society buildings",
                icon: Building2,
                link: "/admin/buildings",
                color: "bg-blue-600",
              }}
            />
            <DashboardCard
              type="action"
              data={{
                title: "New Announcement",
                desc: "Send notices to residents",
                icon: Megaphone,
                link: "/admin/announcements",
                color: "bg-cyan-600",
              }}
            />
            <DashboardCard
              type="action"
              data={{
                title: "Complaints",
                desc: "Review and manage all issues",
                icon: Wrench,
                link: "/admin/complaints",
                color: "bg-red-600",
              }}
            />
          </div>
        </div>

        {/* TWO COL - PENDING ISSUES & ANNOUNCEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
