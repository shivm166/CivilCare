import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Home,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  Bell,
  Settings,
  Link,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Static data for charts
  const monthlyData = [
    { month: "Jan", users: 45, complaints: 12, maintenance: 85000 },
    { month: "Feb", users: 52, complaints: 8, maintenance: 82000 },
    { month: "Mar", users: 61, complaints: 15, maintenance: 88000 },
    { month: "Apr", users: 70, complaints: 10, maintenance: 90000 },
    { month: "May", users: 78, complaints: 18, maintenance: 87000 },
    { month: "Jun", users: 85, complaints: 14, maintenance: 92000 },
  ];

  const complaintTypeData = [
    { name: "Maintenance", value: 35, color: "#3b82f6" },
    { name: "Security", value: 25, color: "#ef4444" },
    { name: "Cleanliness", value: 20, color: "#f59e0b" },
    { name: "Parking", value: 15, color: "#10b981" },
    { name: "Others", value: 5, color: "#8b5cf6" },
  ];

  const maintenanceStatus = [
    { status: "Paid", count: 145, color: "#10b981" },
    { status: "Pending", count: 32, color: "#f59e0b" },
    { status: "Overdue", count: 8, color: "#ef4444" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user",
      message: "New resident registered - Flat 402",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "complaint",
      message: "Complaint resolved - Elevator issue",
      time: "15 min ago",
    },
    {
      id: 3,
      type: "payment",
      message: "Maintenance payment received - Flat 305",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "alert",
      message: "Security alert - Gate A",
      time: "2 hours ago",
    },
  ];

  const StatCard = ({ icon: Icon, title, value, change, color, bgColor }) => (
    <div
      className={`${bgColor} rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border border-opacity-20`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-2`}>{value}</p>
          <div className="flex items-center">
            <TrendingUp
              className={`w-4 h-4 ${
                change >= 0 ? "text-green-500" : "text-red-500"
              } mr-1`}
            />
            <span
              className={`text-sm ${
                change >= 0 ? "text-green-600" : "text-red-600"
              } font-semibold`}
            >
              {change >= 0 ? "+" : ""}
              {change}% from last month
            </span>
          </div>
        </div>
        <div className={`${color} bg-opacity-10 p-4 rounded-full`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  const Navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Society Management
                </h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value="185"
            change={12}
            color="text-blue-600"
            bgColor="bg-blue-50"
            onclick={() => Navigate("/dashboard/admin/residents")}
          />
          <StatCard
            icon={FileText}
            title="Total Complaints"
            value="47"
            change={-8}
            color="text-red-600"
            bgColor="bg-red-50"
          />
          <StatCard
            icon={CheckCircle}
            title="Resolved Issues"
            value="132"
            change={15}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={DollarSign}
            title="Monthly Collection"
            value="₹5.2L"
            change={5}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              User Growth & Complaints Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorComplaints"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Users"
                />
                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorComplaints)"
                  name="Complaints"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Complaint Types Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Complaint Categories
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complaintTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complaintTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Maintenance Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Monthly Maintenance Collection
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="maintenance"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  name="Collection (₹)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Payment Status
            </h3>
            <div className="space-y-4">
              {maintenanceStatus.map((item, index) => (
                <div
                  key={index}
                  className="transform transition-all hover:translate-x-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">
                      {item.status}
                    </span>
                    <span className="font-bold" style={{ color: item.color }}>
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.count / 185) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Collection Rate</span>
                <span className="text-2xl font-bold text-green-600">78%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                >
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      activity.type === "user"
                        ? "bg-blue-100"
                        : activity.type === "complaint"
                        ? "bg-red-100"
                        : activity.type === "payment"
                        ? "bg-green-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {activity.type === "user" && (
                      <Users className="w-4 h-4 text-blue-600" />
                    )}
                    {activity.type === "complaint" && (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    {activity.type === "payment" && (
                      <DollarSign className="w-4 h-4 text-green-600" />
                    )}
                    {activity.type === "alert" && (
                      <Bell className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      {activity.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white transform transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Quick Overview
            </h3>
            <div className="space-y-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm opacity-90">Total Flats</p>
                <p className="text-3xl font-bold mt-1">185</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm opacity-90">Occupied</p>
                <p className="text-3xl font-bold mt-1">178</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm opacity-90">Pending Approvals</p>
                <p className="text-3xl font-bold mt-1">7</p>
              </div>
              <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
                View Details
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
