// frontend/src/pages/dashboard/User/UserDashboard/ResidentDashboard.jsx
import React, { useMemo } from "react";
import {
  Megaphone,
  Users,
  Wrench,
  Loader2,
  CheckCircle2,
  Clock,
  Home,
  User,
  Bell,
  AlertCircle,
  Phone,
  Zap,
} from "lucide-react";
import Container from "../../../../components/layout/Container/Container";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useGetMyComplaints } from "../../../../hooks/api/useComplaints";
import { useGetUserAnnouncements } from "../../../../hooks/api/useAnnouncements";
import { useMyInvitations } from "../../../../hooks/api/useInvitations";
import { useMembers } from "../../../../hooks/api/useMembers";
import useProfile from "../../../../hooks/api/auth/useProfile";
import DashboardCard from "../../../../components/features/dashboard/DashboardCard";
import Card from "../../../../components/common/Card/Card";

const ResidentDashboard = () => {
  const { activeSocietyId, activeSociety } = useSocietyContext();
  const { user, loading: userLoading } = useProfile();
  const { data: myComplaintsData, isLoading: complaintsLoading } =
    useGetMyComplaints(activeSocietyId);
  const { data: announcementsData, isLoading: announcementsLoading } =
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
    const totalActiveComplaints = pending.length + inProgress.length;

    return {
      myUnit: myMemberInfo?.unit || null,
      admins:
        members?.filter((m) => m.roleInSociety === "admin").slice(0, 3) || [],
      stats: {
        pendingComplaints: totalActiveComplaints,
        pendingInvitations: invitationsData?.count || 0,
        totalMembers: membersCount || 0,
        totalAnnouncements: announcements.length || 0,
        totalComplaints: myComplaints.length,
      },
      complaintStats: {
        resolved: resolved.length,
        inProgress: inProgress.length,
      },
      recentAnnouncements: announcements
        .slice(0, 4)
        .map((a) => ({ ...a, title: a.title, description: a.description })),
      recentComplaints: myComplaints.slice(0, 4),
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
      <div className="flex items-center justify-center h-screen bg-base-200">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <Container className="py-6 sm:py-8 lg:py-10 space-y-7 lg:space-y-10">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-400 bg-clip-text text-transparent">
              Hello, {user?.name?.split(" ")[0] || "Resident"}!
            </h1>
            <p className="mt-2 text-sm lg:text-base text-gray-500">
              Welcome to{" "}
              <span className="font-semibold text-indigo-600">
                {activeSociety?.societyName || "your society"}
              </span>{" "}
              Dashboard.
            </p>
          </div>
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
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            type="stat"
            data={{
              title: "Total Members",
              value: stats.totalMembers,
              icon: Users,
              link: "/user/residents",
              gradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
            }}
          />
          <DashboardCard
            type="stat"
            data={{
              title: "Open Complaints",
              value: stats.pendingComplaints,
              icon: AlertCircle,
              link: "/user/raise-complaint",
              gradient: "bg-gradient-to-br from-orange-500 to-red-600",
            }}
          />
          <DashboardCard
            type="stat"
            data={{
              title: "New Invitations",
              value: stats.pendingInvitations,
              icon: Bell,
              link: "/user/notifications",
              gradient: "bg-gradient-to-br from-pink-500 to-purple-600",
            }}
          />
          <DashboardCard
            type="stat"
            data={{
              title: "Announcements",
              value: stats.totalAnnouncements,
              icon: Megaphone,
              link: "/user/announcements",
              gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
            }}
          />
        </div>

        {/* MINI STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            type="mini"
            data={{
              icon: Home,
              label: "My Unit",
              value: myUnit?.name || "N/A",
              color: "bg-gradient-to-r from-indigo-500 to-blue-500",
            }}
          />
          <DashboardCard
            type="mini"
            data={{
              icon: CheckCircle2,
              label: "Resolved",
              value: complaintStats.resolved,
              color: "bg-gradient-to-r from-green-500 to-teal-500",
            }}
          />
          <DashboardCard
            type="mini"
            data={{
              icon: Clock,
              label: "In Progress",
              value: complaintStats.inProgress,
              color: "bg-gradient-to-r from-amber-500 to-orange-500",
            }}
          />
          <DashboardCard
            type="mini"
            data={{
              icon: AlertCircle,
              label: "Total Complaints",
              value: stats.totalComplaints,
              color: "bg-gradient-to-r from-red-500 to-pink-500",
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
                title: "Raise Complaint",
                desc: "Report issues instantly",
                icon: Wrench,
                link: "/user/raise-complaint",
                color: "bg-red-600",
              }}
            />
            <DashboardCard
              type="action"
              data={{
                title: "Read Notices",
                desc: "View all society announcements",
                icon: Megaphone,
                link: "/user/announcements",
                color: "bg-purple-600",
              }}
            />
            <DashboardCard
              type="action"
              data={{
                title: "Society Directory",
                desc: "Find contacts and units",
                icon: Users,
                link: "/user/residents",
                color: "bg-blue-600",
              }}
            />
            <DashboardCard
              type="action"
              data={{
                title: "My Profile",
                desc: "Update personal details",
                icon: User,
                link: "/user/profile",
                color: "bg-green-600",
              }}
            />
          </div>
        </div>

        {/* TWO COL - Complaints & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Complaints */}
          <DashboardCard
            type="recent-items"
            data={{
              title: "My Recent Issues",
              items: recentComplaints,
              itemType: "complaint",
              link: "/user/raise-complaint",
            }}
          />
          {/* Announcements */}
          <DashboardCard
            type="recent-items"
            data={{
              title: "Latest News",
              items: recentAnnouncements,
              itemType: "announcement",
              link: "/user/announcements",
            }}
          />
        </div>

        {/* HELPDESK */}
        <DashboardCard
          type="helpdesk"
          data={{ admins: admins, societyName: activeSociety?.societyName }}
        />
      </Container>
    </div>
  );
};

export default ResidentDashboard;
