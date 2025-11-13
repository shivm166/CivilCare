// frontend/src/pages/dashboard/ResidentDashboard.jsx
import React from "react";
import Container from "../../components/layout/Container";

const ResidentDashboard = () => {
  return (
    <Container className="py-4">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">
        Resident Panel Dashboard
      </h2>
      <p className="text-lg text-slate-600 mb-8">
        Welcome to your community hub! Here you can check your status, bills,
        and recent announcements.
      </p>

      {/* Resident specific stats/widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-slate-900">
            Latest Bill Due
          </h3>
          <p className="text-4xl font-bold text-green-600 mt-2">₹ 2,500</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-sky-500">
          <h3 className="text-xl font-semibold text-slate-900">
            My Complaint Status
          </h3>
          <p className="text-4xl font-bold text-sky-600 mt-2">In Progress</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
          <h3 className="text-xl font-semibold text-slate-900">
            Upcoming Event
          </h3>
          <p className="text-lg font-bold text-indigo-600 mt-2">
            Community Fair (Dec 25)
          </p>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Recent Announcements
        </h3>
        <p className="text-slate-600">
          Latest society announcements will be displayed here.
        </p>
      </div>
    </Container>
  );
};

export default ResidentDashboard;
