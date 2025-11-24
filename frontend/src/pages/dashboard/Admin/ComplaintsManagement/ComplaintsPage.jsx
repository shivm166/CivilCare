// frontend/src/pages/dashboard/Admin/ComplaintsManagement/ComplaintsPage.jsx
import { useSocietyContext } from "../../../../contexts/SocietyContext.jsx";
import {
  useGetMyComplaints,
  useUpdateComplaintStatus,
  useGetAllComplaints,
} from "../../../../hooks/api/useComplaints.js";
import { AlertCircle, Wrench, User, Loader2 } from "lucide-react"; // Removed: CheckCircle2, Clock
import StatusBadge from "../../../../components/common/StatusBadge/StatusBadge"; // 💡 NEW IMPORT
import Button from "../../../../components/common/Button/Button"; // 💡 NEW IMPORT

export default function ComplaintsPage() {
  const { activeRole, activeSocietyId } = useSocietyContext();
  const isAdmin = activeRole === "admin";

  const { updateStatus, isUpdating } = useUpdateComplaintStatus();

  // Fetch data based on role
  const { data: myComplaints, isLoading: isLoadingMy } = useGetMyComplaints(
    isAdmin ? null : activeSocietyId
  );

  const { data: allComplaints, isLoading: isLoadingAll } = useGetAllComplaints(
    isAdmin ? activeSocietyId : null
  );

  const isLoading = isAdmin ? isLoadingAll : isLoadingMy;
  const complaints = isAdmin ? allComplaints : myComplaints;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
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
    // Reduced outer padding for mobile
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Reduced size on mobile */}
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <Wrench className="text-white w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {isAdmin ? "Society Complaints" : "My Complaints"}
              </h1>
              <p className="text-xs sm:text-base text-gray-600 mt-1">
                {isAdmin
                  ? `Manage and resolve all issues • ${
                      complaints?.length || 0
                    } total`
                  : `Track your submitted requests • ${
                      complaints?.length || 0
                    } total`}
              </p>
            </div>
          </div>
        </div>

        {/* No complaints state */}
        {(!complaints || complaints.length === 0) && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 sm:h-2"></div>
              <div className="p-8 sm:p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  No Complaints Found
                </h3>
                <p className="text-sm text-gray-500">
                  {isAdmin
                    ? "All clear! No complaints have been submitted yet."
                    : "You haven't submitted any complaints yet. Use the 'Raise Complaint' menu to start."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Complaints Grid - Reduced gap */}
        {complaints && complaints.length > 0 && (
          <div className="grid gap-4 sm:gap-7 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="group relative bg-white rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Vertical Status Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 ${getPriorityColor(
                    c.priority
                  )}`}
                ></div>
                {/* Priority Corner Tag - Adjusted size */}
                <div
                  className={`absolute right-0 top-0 px-2 py-1 text-xs font-bold text-white ${getPriorityColor(
                    c.priority
                  )}`}
                >
                  <StatusBadge type={c.priority} compact />
                </div>

                {/* Reduced padding */}
                <div className="p-4 sm:p-6 pl-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    {/* 💡 REFACTORED: Use StatusBadge */}
                    <StatusBadge
                      type={c.status}
                      compact
                      isPulse={c.status === "pending"}
                    />
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title - Reduced font size on mobile */}
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {c.title}
                  </h3>

                  {/* Description - Reduced font size on mobile */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {c.description}
                  </p>

                  {/* Admin Info (Reported By) - Reduced padding/size */}
                  {isAdmin && c.createdBy && (
                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg p-3 mb-4 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Reported By
                          </p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {c.createdBy?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Action Buttons (Admin Only) - Reduced vertical padding, smaller gap */}
                  {isAdmin && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Update Status
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["pending", "in_progress", "resolved", "closed"].map(
                          (s) => (
                            // 💡 REFACTORED: Use Button component
                            <Button
                              key={s}
                              onClick={() =>
                                updateStatus({ id: c._id, status: s })
                              }
                              disabled={c.status === s}
                              isLoading={isUpdating && c.status !== s}
                              size="sm"
                              variant={
                                s === "pending" || s === "in_progress"
                                  ? "secondary"
                                  : s === "resolved"
                                  ? "success"
                                  : "ghost"
                              }
                              className={
                                c.status === s
                                  ? "bg-indigo-600 text-white" // Force primary style if active
                                  : ""
                              }
                            >
                              {s.replace("_", " ")}
                            </Button>
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
