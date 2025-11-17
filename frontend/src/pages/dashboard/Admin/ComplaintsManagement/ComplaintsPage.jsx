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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "in_progress":
        return "🔄";
      case "resolved":
        return "✅";
      case "closed":
        return "🔒";
      default:
        return "📋";
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">
          Loading complaints...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl sm:text-3xl">
                {isAdmin ? "📢" : "📄"}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isAdmin ? "Society Complaints" : "My Complaints"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {isAdmin
                  ? `Manage and resolve society complaints • ${
                      complaints?.length || 0
                    } total`
                  : `Track your submitted complaints • ${
                      complaints?.length || 0
                    } active`}
              </p>
            </div>
          </div>
        </div>

        {/* No complaints state */}
        {(!complaints || complaints.length === 0) && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
              <div className="p-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">📭</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No Complaints Found
                </h3>
                <p className="text-gray-500">
                  {isAdmin
                    ? "All clear! No complaints have been submitted yet."
                    : "You haven't submitted any complaints yet."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Complaints Grid */}
        {complaints && complaints.length > 0 && (
          <div className="grid gap-6 sm:gap-7 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Color accent bar */}
                <div
                  className={`h-1.5 ${
                    c.status === "pending"
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : c.status === "in_progress"
                      ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                      : c.status === "resolved"
                      ? "bg-gradient-to-r from-emerald-400 to-green-500"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
                ></div>

                <div className="p-5 sm:p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        c.status
                      )}`}
                    >
                      <span>{getStatusIcon(c.status)}</span>
                      {c.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
                    {c.description}
                  </p>

                  {/* Admin Info */}
                  {isAdmin && c.createdBy && (
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Reported By
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <span className="text-blue-600">👤</span>
                          {c.createdBy?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-2">
                          <span>📧</span>
                          {c.createdBy?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Action Buttons (Admin Only) */}
                  {isAdmin && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Update Status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["pending", "in_progress", "resolved", "closed"].map(
                          (s) => (
                            <button
                              key={s}
                              onClick={() =>
                                updateStatus({ id: c._id, status: s })
                              }
                              disabled={isUpdating || c.status === s}
                              className={`
                              px-3 py-1.5 rounded-lg text-xs font-semibold
                              transition-all duration-200 transform
                              ${
                                c.status === s
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105"
                              }
                              ${
                                isUpdating
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                            >
                              {isUpdating && c.status !== s && (
                                <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-1"></span>
                              )}
                              {s.replace("_", " ")}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
