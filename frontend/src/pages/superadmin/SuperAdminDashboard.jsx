import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSuperAdminStats } from "../../lib/api";
import { LayoutDashboard, Users, Building2, FileText } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color = "bg-white" }) => {
  return (
    <div className="card shadow-sm p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm text-gray-500">{title}</h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold">{value ?? 0}</span>
          </div>
        </div>
        <div className="p-3 rounded-md bg-indigo-50">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

function SuperAdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["superadminStats"],
    queryFn: getSuperAdminStats,
    staleTime: 1000 * 60 * 2,
  });

  // fallback placeholders
  const stats = data || {
    totalUsers: "--",
    totalSocieties: "--",
    totalComplaints: "--",
    totalAnnouncements: "--",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-white shadow-sm animate-pulse h-28" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500">Failed to load stats.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Societies"
            value={stats.totalSocieties ?? 0}
            icon={Building2}
          />
          <StatCard title="Total Users" value={stats.totalUsers ?? 0} icon={Users} />
          <StatCard
            title="Total Complaints"
            value={stats.totalComplaints ?? 0}
            icon={FileText}
          />
          <StatCard title="Other Metric" value={stats.totalAnnouncements ?? 0} icon={LayoutDashboard} />
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Overview</h2>
        <p className="text-gray-600">
          Use the Societies and Users tabs to manage system-wide records. Click update to edit or delete to remove entries.
        </p>
      </section>
    </div>
  );
}

export default SuperAdminDashboard;