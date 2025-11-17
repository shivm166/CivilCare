import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building,
  Megaphone,
  AlertCircle,
  User,
  Bell,
  TrendingUp,
} from "lucide-react";
import { useSocietyWiseUserCount } from "../../../../hooks/api/useSocietyWiseCount";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSocietyWiseUserCount();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold">
            Error loading dashboard
          </p>
          <p className="text-gray-500 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const dashboardData = data?.data || {};

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
    bgColor,
    trend,
    onClick,
  }) => (
    <div
      className={`${bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-3`}>{value || 0}</p>
          {trend && (
            <div className="flex items-center text-sm">
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  trend > 0 ? "text-green-500" : "text-red-500"
                }`}
              />
              <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
                {trend > 0 ? "+" : ""}
                {trend}% this month
              </span>
            </div>
          )}
        </div>
        <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {dashboardData.society?.name || "Society Management"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                  ADMIN
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={dashboardData.totalUsers}
            color="text-blue-600"
            bgColor="bg-blue-50"
            trend={12}
            onClick={() => navigate("/admin/residents")}
          />
          <StatCard
            icon={Building}
            title="Society Members"
            value={dashboardData.totalSocietyMembers}
            color="text-purple-600"
            bgColor="bg-purple-50"
            trend={8}
          />
          <StatCard
            icon={Megaphone}
            title="Announcements"
            value={dashboardData.totalAnnouncements}
            color="text-green-600"
            bgColor="bg-green-50"
            trend={5}
            onClick={() => navigate("/admin/announcements")}
          />
          <StatCard
            icon={AlertCircle}
            title="Total Complaints"
            value={dashboardData.totalComplaints}
            color="text-orange-600"
            bgColor="bg-orange-50"
            trend={-3}
            onClick={() => navigate("/admin/complaints")}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Complaint Status */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
              Complaint Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Pending
                  </span>
                  <span className="text-lg font-bold text-orange-600">
                    {dashboardData.pendingComplaints || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        dashboardData.totalComplaints > 0
                          ? (dashboardData.pendingComplaints /
                              dashboardData.totalComplaints) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Resolved
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {dashboardData.resolvedComplaints || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        dashboardData.totalComplaints > 0
                          ? (dashboardData.resolvedComplaints /
                              dashboardData.totalComplaints) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="text-xl font-bold text-green-600">
                  {dashboardData.totalComplaints > 0
                    ? Math.round(
                        (dashboardData.resolvedComplaints /
                          dashboardData.totalComplaints) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-orange-600" />
                Recent Complaints
              </span>
              <button
                onClick={() => navigate("/admin/complaints")}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All
              </button>
            </h3>
            <div className="space-y-3">
              {dashboardData.recentComplaints?.length > 0 ? (
                dashboardData.recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                  >
                    <div
                      className={`p-2 rounded-full mr-3 ${
                        complaint.status === "resolved"
                          ? "bg-green-100"
                          : "bg-orange-100"
                      }`}
                    >
                      <AlertCircle
                        className={`w-4 h-4 ${
                          complaint.status === "resolved"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {complaint.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          {complaint.building}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {complaint.time}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        complaint.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No complaints yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Members */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Recent Members
            </span>
            <button
              onClick={() => navigate("/admin/residents")}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </button>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.recentMembers?.length > 0 ? (
              dashboardData.recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {member.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 capitalize">
                        {member.role}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {member.building}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {member.joinedDate}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No members yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
