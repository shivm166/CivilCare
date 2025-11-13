// src/pages/MyComplaintsPage.jsx
import { useState } from "react";
import { useCreateComplaint, useGetMyComplaints } from "../../../../hooks/api/useComplaints";

export default function RaiseComplaintPage() {
  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  // React Query hooks
  const { createComplaint, isCreating } = useCreateComplaint();
  const { data: complaints, isLoading, error } = useGetMyComplaints();

  // Handle form submit
  const handleSubmit = (e) => {
    console.log("Submitting complaint with data:", form);
    e.preventDefault();
    if (!form.title || !form.description) return;

    createComplaint(form, {
      onSuccess: () => {
        setForm({ title: "", description: "", priority: "medium" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Complaints
        </h1>

        {/* Create Complaint Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Raise a New Complaint
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g., Water leakage in kitchen"
                value={form.title}
                name="title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                rows="3"
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${
                isCreating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isCreating ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Your Complaints ({complaints?.length || 0})
          </h2>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading complaints...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              Error loading complaints. Please try again.
            </div>
          )}

          {/* No Complaints */}
          {!isLoading && !error && complaints?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                No complaints yet. Create your first one!
              </p>
            </div>
          )}

          {/* Complaints List */}
          {!isLoading &&
            complaints?.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {complaint.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {complaint.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        complaint.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : complaint.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {complaint.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      complaint.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : complaint.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : complaint.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {complaint.status.replace("-", " ").toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
