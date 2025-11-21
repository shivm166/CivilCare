import React from "react";
import { LayoutDashboard, Users, Building2, FileText } from "lucide-react";
import { useSuperAdminStats } from "../../../../hooks/api/useSuperAdmin";
import { Link } from "react-router-dom"

const StatCard = ({ title, value, icon: Icon, color = "bg-white" }) => {
  return (
    <div className="card shadow-sm p-6 rounded-lg bg-white border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm text-gray-600 mb-1">{title}</h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">{value ?? 0}</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-indigo-50">
          <Icon className="w-8 h-8 text-indigo-600" />
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of the entire CivilCare platform
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-lg bg-white shadow-sm animate-pulse h-32 border border-gray-200"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load statistics. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <section className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Platform Overview
        </h2>
        <div className="space-y-2 text-gray-600">
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
            <span>⚠️</span>
            <span>
              Be careful when deleting societies or changing user roles. These actions may affect active users.
            </span>
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">
            Manage Societies
          </h3>
          <p className="text-indigo-700 text-sm mb-4">
            View, edit, and manage all housing societies on the platform
          </p>
          <Link
            to="/superadmin/societies"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Societies
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Manage Users
          </h3>
          <p className="text-purple-700 text-sm mb-4">
            View, edit user details, and change global roles
          </p>
          <Link
            to="/superadmin/users"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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