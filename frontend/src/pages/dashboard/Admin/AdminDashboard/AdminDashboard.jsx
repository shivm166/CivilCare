// frontend/src/pages/dashboard/AdminDashboard.jsx
import React from "react";
import Container from "../../components/layout/Container";

const AdminDashboard = () => {
  return (
    <Container className="py-4">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">
        Admin Panel Dashboard
      </h2>
      <p className="text-lg text-slate-600 mb-8">
        Welcome, Admin! This dashboard provides a complete overview of all
        society operations and management tools.
      </p>

      {/* Admin specific stats/widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-emerald-500">
          <h3 className="text-xl font-semibold text-slate-900">
            Total Residents
          </h3>
          <p className="text-4xl font-bold text-emerald-600 mt-2">450</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-500">
          <h3 className="text-xl font-semibold text-slate-900">
            Pending Complaints
          </h3>
          <p className="text-4xl font-bold text-amber-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold text-slate-900">
            Overdue Bills
          </h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">₹ 55,000</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Admin Quick Actions
        </h3>
        <p className="text-slate-600">
          Admin-specific controls and quick access links will be placed here.
        </p>
      </div>
    </Container>
  );
};

export default AdminDashboard;
