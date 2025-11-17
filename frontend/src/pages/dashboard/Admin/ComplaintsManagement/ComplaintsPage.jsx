import { useSocietyContext } from "../../../../contexts/SocietyContext.jsx";
import {
  useGetMyComplaints,
  useUpdateComplaintStatus,
  useGetAllComplaints,
} from "../../../../hooks/api/useComplaints.js";

export default function MyComplaintsPage() {
  const { activeRole, activeSocietyId } = useSocietyContext();
  const isAdmin = activeRole === "admin";

  const { updateStatus, isUpdating } = useUpdateComplaintStatus();

  const { data: myComplaints, isLoading: isLoadingMy } = useGetMyComplaints(
    isAdmin ? null : activeSocietyId
  );

  const { data: allComplaints, isLoading: isLoadingAll } = useGetAllComplaints(
    isAdmin ? activeSocietyId : null
  );

  const isLoading = isAdmin ? isLoadingAll : isLoadingMy;
  const complaints = isAdmin ? allComplaints : myComplaints;

  if (isLoading) return <div className="loading loading-spinner"></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isAdmin ? "Society Complaints" : "My Complaints"}
      </h1>

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

              {isAdmin && c.createdBy && (
                <div className="text-sm text-gray-500 pt-2 border-t mt-2">
                  <p>
                    Reported by: <strong>{c.createdBy?.name || "N/A"}</strong>
                  </p>
                  <p>Email: {c.createdBy?.email || "N/A"}</p>
                </div>
              )}

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
