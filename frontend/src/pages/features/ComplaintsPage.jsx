// pages/MyComplaintsPage.jsx (અથવા જ્યાં પણ complaints list છે)
import { useSocietyContext } from "../../context/SocietyContext";
import {
  useGetMyComplaints,
  useUpdateComplaintStatus,
} from "../../hooks/useComplaints";

export default function MyComplaintsPage() {
  const { activeRole } = useSocietyContext(); // <-- આ જ ચેક કરે છે
  const isAdmin = activeRole === "admin";

  const { updateStatus, isUpdating } = useUpdateComplaintStatus();

  const { data: complaints, isLoading } = useGetMyComplaints();

  if (isLoading) return <div className="loading loading-spinner"></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Complaints</h1>

      <div className="space-y-4">
        {complaints?.map((c) => (
          <div key={c._id} className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">{c.title}</h3>
              <p>{c.description}</p>

              {/* STATUS BADGES */}
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`badge ${
                    c.status === "pending" ? "badge-warning" : "badge-success"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              {/* ADMIN ONLY: STATUS UPDATE BUTTONS */}
              {isAdmin && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {["pending", "in-progress", "resolved", "closed"].map((s) => (
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
