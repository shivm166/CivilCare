import React from "react";
import { LayoutDashboard, Users, Building2, FileText } from "lucide-react";
import { useSuperAdminStats } from "../../../../hooks/api/useSuperAdmin";
import { Link } from "react-router-dom"

const StatCard = ({ title, value, icon: Icon, color = "bg-white" }) => {
  return (
    <div className="card shadow-sm p-4 sm:p-6 rounded-lg bg-white border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{title}</h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{value ?? 0}</span>
          </div>
        </div>
        <div className="p-2 sm:p-3 rounded-lg bg-indigo-50 shrink-0">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

function SuperAdminDashboard() {
  const { data, isLoading, isError } = useSuperAdminStats();

  const stats = data || {
    totalUsers: "--",
    totalSocieties: "--",
    totalComplaints: "--",
    totalAnnouncements: "--",
  };

  return (
    <>
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-xs sm:text-base text-gray-600 mt-1">
          Overview of the entire CivilCare platform
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 sm:p-6 rounded-lg bg-white shadow-sm animate-pulse h-24 sm:h-32 border border-gray-200"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
          Failed to load statistics. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Societies"
            value={stats.totalSocieties ?? 0}
            icon={Building2}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers ?? 0}
            icon={Users}
          />
          <StatCard
            title="Pending Complaints"
            value={stats.totalComplaints ?? 0}
            icon={FileText}
          />
          <StatCard
            title="Announcements"
            value={stats.totalAnnouncements ?? 0}
            icon={LayoutDashboard}
          />
        </div>
      )}

      {/* Overview Section */}
      <section className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
          Platform Overview
        </h2>
        <div className="space-y-2 text-gray-600 text-sm sm:text-base">
          <p>
            • Use the <strong>Societies</strong> tab to manage housing societies, edit details, and view member counts
          </p>
          <p>
            • Use the <strong>Users</strong> tab to manage user accounts and change global roles
          </p>
          <p>
            • Super admins have full access to all societies and can perform administrative actions
          </p>
          <p className="text-amber-600 flex items-start gap-2">
            <span className="shrink-0">⚠️</span>
            <span>
              Be careful when deleting societies or changing user roles. These actions may affect active users.
            </span>
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-linear-to-br from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-lg border border-indigo-200">
          <h3 className="text-base sm:text-lg font-semibold text-indigo-900 mb-2">
            Manage Societies
          </h3>
          <p className="text-indigo-700 text-xs sm:text-sm mb-3 sm:mb-4">
            View, edit, and manage all housing societies on the platform
          </p>
          <Link
            to="/superadmin/societies"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Societies
          </Link>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg border border-purple-200">
          <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">
            Manage Users
          </h3>
          <p className="text-purple-700 text-xs sm:text-sm mb-3 sm:mb-4">
            View, edit user details, and change global roles
          </p>
          <Link
            to="/superadmin/users"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Users
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}

export default SuperAdminDashboard;