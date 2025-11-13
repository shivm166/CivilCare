// pages/MyComplaintsPage.jsx (અથવા જ્યાં પણ complaints list છે)
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import {
  useGetMyComplaints,
  useUpdateComplaintStatus,
  useGetAllComplaints, // ✅ ADD THIS IMPORT
} from "../../../../hooks/api/useComplaints";

export default function MyComplaintsPage() {
  const { activeRole } = useSocietyContext(); // <-- આ જ ચેક કરે છે
  const isAdmin = activeRole === "admin";

  const { updateStatus, isUpdating } = useUpdateComplaintStatus();

  // ✅ FIX: Conditionally fetch complaints based on role
  const { data: myComplaints, isLoading: isLoadingMy } = useGetMyComplaints({
    enabled: !isAdmin, // Only run if user is NOT admin
  });

  const { data: allComplaints, isLoading: isLoadingAll } = useGetAllComplaints({
    enabled: isAdmin, // Only run if user IS admin
  });

  // ✅ FIX: Determine correct data and loading state
  const isLoading = isAdmin ? isLoadingAll : isLoadingMy;
  const complaints = isAdmin ? allComplaints : myComplaints;

  if (isLoading) return <div className="loading loading-spinner"></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {/* ✅ FIX: Dynamic title */}
        {isAdmin ? "Society Complaints" : "My Complaints"}
      </h1>

      {/* ✅ FIX: Handle empty state */}
      {(!complaints || complaints.length === 0) && (
        <div className="card bg-base-100 shadow">
          <div className="card-body text-center">
            <p className="text-gray-500">No complaints found.</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {complaints?.map((c) => (
          <div key={c._id} className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">{c.title}</h3>
              <p>{c.description}</p>

              {/* ✅ ADDED: Show who created it (for admin) */}
              {isAdmin && (
                <div className="text-sm text-gray-500 pt-2 border-t mt-2">
                  <p>
                    Reported by: <strong>{c.createdBy?.name || "N/A"}</strong>
                  </p>
                  <p>Email: {c.createdBy?.email || "N/A"}</p>
                </div>
              )}

              {/* STATUS BADGES */}
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`badge ${
                    c.status === "pending"
                      ? "badge-warning"
                      : c.status === "in_progress"
                      ? "badge-info"
                      : c.status === "resolved"
                      ? "badge-success"
                      : "badge-ghost"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              {/* ADMIN ONLY: STATUS UPDATE BUTTONS */}
              {isAdmin && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {["pending", "in_progress", "resolved", "closed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus({ id: c._id, status: s })}
                      disabled={isUpdating || c.status === s}
                      className={`btn btn-sm ${
                        c.status === s ? "btn-primary" : "btn-outline"
                      } ${isUpdating ? "loading" : ""}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
