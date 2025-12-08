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

const StatCard = ({ title, value, Icon, to, gradient }) => (
  <div className="transform-gpu">
    <Link
      to={to}
      className={`block rounded-xl p-4 sm:p-5 shadow-sm ${gradient} relative overflow-hidden hover:shadow-md transition-shadow duration-150`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-white text-xs font-medium truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {typeof value === "number" ? value : value ?? 0}
          </p>
        </div>
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white opacity-95" />
      </div>
    </Link>
  </div>
);

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
        recentAnnouncements: announcements.slice(0, 4),
        recentComplaints: complaints.slice(0, 4),
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Container className="py-6 lg:py-10">
        <div className="space-y-6 lg:space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Hello, {user?.name?.split(" ")[0] || "Resident"}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome to{" "}
                <span className="font-semibold text-indigo-600">
                  {activeSociety?.societyName || "your society"}
                </span>
              </p>
            </div>

            <Card className="shadow-md bg-white border border-gray-100 w-full md:w-auto">
              <div className="flex items-center gap-3 p-3">
                <div className="p-2 bg-indigo-50 rounded-full">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">
                    {user?.name || "Resident"}
                  </p>
                  <p className="text-gray-600">
                    {myUnit ? `Unit ${myUnit.name}` : "No unit linked"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              title="Total Members"
              value={stats.totalMembers}
              Icon={Users}
              to="/user/residents"
              gradient="bg-gradient-to-br from-blue-600 to-cyan-600"
            />
            <StatCard
              title="Open Complaints"
              value={stats.pendingComplaints}
              Icon={AlertCircle}
              to="/user/raise-complaint"
              gradient="bg-gradient-to-br from-orange-500 to-red-600"
            />
            <StatCard
              title="New Invitations"
              value={stats.pendingInvitations}
              Icon={Bell}
              to="/user/notifications"
              gradient="bg-gradient-to-br from-pink-500 to-purple-600"
            />
            <StatCard
              title="Announcements"
              value={stats.totalAnnouncements}
              Icon={Megaphone}
              to="/user/announcements"
              gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <Card className="h-full border p-0">
                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-center">
                      <Wrench className="text-orange-600 w-5 h-5" />
                      <h3 className="font-semibold text-lg">
                        My Recent Issues
                      </h3>
                    </div>
                    <Link
                      to="/user/raise-complaint"
                      className="text-sm font-medium text-indigo-600 flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {recentComplaints.length > 0 ? (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                      {recentComplaints.map((c, i) => (
                        <Link
                          key={c._id || i}
                          to="/user/raise-complaint"
                          className="group block bg-white p-3 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-lg">
                                {(c.title || "!").charAt(0).toUpperCase()}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <p className="font-semibold text-sm truncate">
                                  {c.title || "Untitled"}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                                    {c.priority
                                      ? String(c.priority).toUpperCase()
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                                  <div className="truncate">
                                    <span className="sr-only">Status</span>
                                    <StatusBadge type={c.status} compact />
                                  </div>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="truncate">
                                    {c?.unit
                                      ? `Unit ${c.unit?.name || c.unit}`
                                      : myUnit
                                      ? `My Unit`
                                      : ""}
                                  </span>
                                </div>

                                <div className="flex-shrink-0">
                                  <span className="text-[11px] text-gray-400">
                                    {new Date(
                                      c.createdAt || Date.now()
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                                {c.description || "-"}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Wrench className="w-12 h-12 text-orange-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        No complaints raised yet.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div>
              <Card className="h-full border p-0">
                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-center">
                      <Megaphone className="text-purple-600 w-5 h-5" />
                      <h3 className="font-semibold text-lg">Latest News</h3>
                    </div>
                    <Link
                      to="/user/announcements"
                      className="text-sm font-medium text-indigo-600 flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {recentAnnouncements.length > 0 ? (
                    <div className="space-y-3">
                      {recentAnnouncements.map((a) => (
                        <Link
                          key={a._id}
                          to="/user/announcements"
                          className="block bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center text-purple-600 font-semibold">
                              {(a.title || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {a.title || "Untitled"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {a.description || "-"}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Megaphone className="w-10 h-10 text-purple-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No announcements available.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <div>
            <Card className="p-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-2 border-white">
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-md sm:text-lg font-semibold">
                    Society Helpdesk
                  </h3>
                </div>
                <p className="text-gray-700 mb-4 text-sm">
                  Reach out to your society administrators — tap to call or
                  email directly.
                </p>

                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
                  {admins.length > 0 ? (
                    admins.map((admin) => {
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
                        <div
                          key={admin._id}
                          className="flex flex-col items-center gap-2 p-3 bg-white/90 rounded-md border border-gray-100 shadow-sm text-center"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-base">
                            {initials || "?"}
                          </div>

                          <div className="min-w-0 w-full">
                            <h4 className="font-medium text-sm truncate">
                              {name}
                            </h4>
                            <div className="mt-1 flex flex-col items-center gap-1">
                              <span className="text-[11px] font-semibold text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                                ADMIN
                              </span>
                              <div className="text-[12px] text-gray-600 truncate">
                                {phone || "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex items-center gap-2 mt-2">
                            {phone ? (
                              <a
                                href={`tel:${phone}`}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-indigo-50 transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                                <span className="truncate">Call</span>
                              </a>
                            ) : (
                              <button className="flex-1 inline-flex items-center justify-center gap-2 px-2 py-1 text-xs border border-gray-200 rounded-md opacity-60 cursor-not-allowed">
                                <Phone className="w-4 h-4" />
                                <span>Call</span>
                              </button>
                            )}

                            {email ? (
                              <a
                                href={`mailto:${email}`}
                                className="inline-flex items-center justify-center gap-2 px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-indigo-50 transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                                <span className="truncate">Email</span>
                              </a>
                            ) : (
                              <button className="inline-flex items-center justify-center gap-2 px-2 py-1 text-xs border border-gray-200 rounded-md opacity-60 cursor-not-allowed">
                                <Mail className="w-4 h-4" />
                                <span>Email</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-4">
                      <p className="text-sm text-gray-500 italic">
                        No administrators found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ResidentDashboard;
