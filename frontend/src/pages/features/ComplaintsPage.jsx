import {
  useGetAllComplaints,
  useUpdateComplaintStatus,
} from "../../hooks/useComplaints";

export default function AdminDashboard() {
  const { data: complaints, isLoading } = useGetAllComplaints();
  const { updateStatus, isUpdating } = useUpdateComplaintStatus();

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        All Society Complaints
      </h1>

      <div className="grid gap-6">
        {complaints?.map((c) => (
          <div
            key={c._id}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="card-title text-xl">{c.title}</h3>
                  <p className="text-base-content/70 mt-1">{c.description}</p>
                  <p className="text-sm mt-2">
                    <strong>By:</strong> {c.createdBy?.name} (
                    {c.createdBy?.email})
                  </p>
                </div>
                <div
                  className={`badge badge-lg ${
                    c.priority === "high"
                      ? "badge-error"
                      : c.priority === "medium"
                      ? "badge-warning"
                      : "badge-success"
                  }`}
                >
                  {c.priority.toUpperCase()}
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                {["pending", "in-progress", "resolved", "closed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus({ id: c._id, status: s })}
                    disabled={isUpdating || c.status === s}
                    className={`btn btn-sm ${
                      c.status === s
                        ? "btn-primary"
                        : "btn-outline btn-secondary"
                    } ${isUpdating ? "loading" : ""}`}
                  >
                    {s.replace("-", " ")}
                  </button>
                ))}
              </div>

              <div className="mt-3 text-right text-sm text-base-content/60">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
