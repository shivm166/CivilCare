import React from "react";
import { useSocietyComplaints } from "../../hooks/useComplaints";
import { Loader2, AlertCircle } from "lucide-react";

const Complaints = () => {
  // 🔹 Get societyId (example: from localStorage or context)
  const societyId = localStorage.getItem("societyId");

  // 🔹 Use custom hook to fetch complaints
  const {
    data: complaints,
    isLoading,
    isError,
  } = useSocietyComplaints(societyId);

  // 🔹 Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading complaints...</span>
      </div>
    );
  }

  // 🔹 Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center text-red-600 h-40">
        <AlertCircle className="mr-2" />
        <span>Failed to load complaints. Please try again later.</span>
      </div>
    );
  }

  // 🔹 Empty state
  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No complaints found for this society.
      </div>
    );
  }

  // 🔹 Success: render complaints list
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        All Complaints
      </h2>

      {complaints.map((complaint) => (
        <div
          key={complaint._id}
          className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>

          <p className="text-gray-600 mt-1">{complaint.description}</p>

          <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
            <span>
              Status:{" "}
              <span
                className={`font-semibold ${
                  complaint.status === "resolved"
                    ? "text-green-600"
                    : complaint.status === "in_progress"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {complaint.status}
              </span>
            </span>

            <span>
              Priority:{" "}
              <span
                className={`font-semibold ${
                  complaint.priority === "high"
                    ? "text-red-600"
                    : complaint.priority === "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {complaint.priority}
              </span>
            </span>
          </div>

          {complaint.unit && (
            <p className="text-sm text-gray-500 mt-1">Unit: {complaint.unit}</p>
          )}

          <p className="text-xs text-gray-400 mt-2">
            Created at:{" "}
            {new Date(complaint.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Complaints;
