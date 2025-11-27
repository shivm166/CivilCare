// frontend/src/pages/dashboard/Admin/ComplaintsManagement/ComplaintsPage.jsx (MODIFIED)

import { useSocietyContext } from "../../../../contexts/SocietyContext.jsx";
import {
  useGetMyComplaints,
  useUpdateComplaintStatus,
  useGetAllComplaints,
} from "../../../../hooks/api/useComplaints.js";
import {
  AlertCircle,
  Wrench,
  User,
  Clock,
  Zap,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import StatusBadge from "../../../../components/common/StatusBadge/StatusBadge";
import Button from "../../../../components/common/Button/Button";

// Helper map for icons and button styling
const actionMap = {
  pending: {
    icon: Clock,
    label: "Pending",
    variant: "secondary",
    className: "hover:!bg-amber-100 hover:!text-amber-700",
  },
  in_progress: {
    icon: Zap,
    label: "In Progress",
    variant: "primary",
    className: "!bg-blue-600 hover:!bg-blue-700",
  },
  resolved: {
    icon: CheckCircle2,
    label: "Resolved",
    variant: "success",
    className: "hover:!bg-green-700",
  },
  closed: {
    icon: XCircle,
    label: "Closed",
    variant: "ghost",
    className: "hover:!bg-gray-100",
  },
};

// Complaint Row Component - Redesigned UI
const ComplaintRow = ({ c, isAdmin, updateStatus, isUpdating }) => {
  // Utility function for setting visual differentiation based on complaint status
  const getRowVisuals = (status) => {
    switch (status) {
      // Subtle background/border hints for active statuses
      case "pending":
        return { border: "border-l-indigo-500", background: "bg-indigo-50/20" };
      case "in_progress":
        return { border: "border-l-blue-500", background: "bg-blue-50/20" };
      case "resolved":
        return { border: "border-l-green-500", background: "bg-green-50/20" };
      case "closed":
        return { border: "border-l-gray-500", background: "bg-gray-50/20" };
      default:
        return { border: "border-l-gray-300", background: "bg-white" };
    }
  };

  const { border, background } = getRowVisuals(c.status);

  return (
    <div
      key={c._id}
      // Responsive list item structure
      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-200 
                    p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 relative border-l-4 ${border} ${background}
                    `}
    >
      {/* Column 1: Main Info (Title, Description, Reporter) */}
      <div className="flex-1 min-w-0 md:max-w-[35%]">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2 hover:text-indigo-600 transition-colors">
          {c.title}
        </h3>
        {isAdmin && c.createdBy && (
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
            <User className="w-4 h-4 text-indigo-500" />
            <span className="font-medium truncate">
              Reported By: {c.createdBy?.name || "Unknown"}
            </span>
          </div>
        )}
      </div>

      {/* Column 2: Status & Date (ATTRACTIVE DISPLAY) */}
      <div className="flex flex-col gap-1.5 md:w-36 md:flex-shrink-0">
        {/* Status Badge */}
        <StatusBadge
          type={c.status}
          compact
          isPulse={c.status === "pending"}
          className="w-fit shadow-sm"
        />
        {/* Date */}
        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(c.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Column 3: Priority (VISUALLY SEPARATED) */}
      <div className="flex flex-col gap-1.5 md:w-24 md:flex-shrink-0 md:items-start">
        {/* Priority Badge */}
        <StatusBadge
          type={c.priority}
          compact
          isPulse={c.priority === "high"}
        />
      </div>

      {/* Column 4 (Admin Only): Actions (ATTRACTIVE BUTTON GROUP) */}
      {isAdmin && (
        <div className="w-full md:w-auto md:max-w-[40%] pt-3 md:pt-0 border-t border-gray-100 md:border-t-0 md:flex md:flex-wrap gap-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 md:hidden">
            Update Status
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(actionMap).map((s) => {
              const action = actionMap[s];
              const isActive = c.status === s;

              // Display the actively selected status as a prominent button
              if (isActive) {
                return (
                  <Button
                    key={s}
                    size="sm"
                    icon={action.icon}
                    // Strong gradient styling for active status
                    className={`!rounded-full !bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold !shadow-md`}
                    disabled
                  >
                    {action.label}
                  </Button>
                );
              }

              // Display other actions as regular, clickable buttons
              return (
                <Button
                  key={s}
                  onClick={() => updateStatus({ id: c._id, status: s })}
                  disabled={isUpdating && c.status !== s}
                  isLoading={isUpdating && c.status !== s}
                  size="sm"
                  variant={action.variant}
                  icon={action.icon}
                  className={`!rounded-full ${action.className || ""}`}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ... (Rest of ComplaintsPage.jsx remains the same)

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

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
        <p className="mt-6 text-gray-600 font-medium animate-pulse">
          Loading complaints...
        </p>
      </div>
    );

  return (
    // Outer container uses minimal background
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Minimalist */}
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Wrench className="text-white w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
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

        {/* Complaints List Container (Replaces grid) */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header (Desktop Only) */}
          {complaints && complaints.length > 0 && (
            <div
              className={`hidden md:grid md:grid-cols-[1fr_144px_96px_360px] lg:grid-cols-[1fr_144px_96px_360px] text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-100 p-4 border-b border-gray-200`}
            >
              <div className="pl-1.5">Issue & Reporter</div>
              <div className="text-center">Status & Date</div>
              <div className="text-center">Priority</div>
              <div className="pl-2">Admin Actions</div>
            </div>
          )}

          {/* No complaints state */}
          {(!complaints || complaints.length === 0) && (
            <div className="max-w-md mx-auto">
              <div className="p-8 sm:p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-gray-400" />
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
          )}

          {/* Complaints List */}
          {complaints && complaints.length > 0 && (
            <div className="divide-y divide-gray-100">
              {complaints.map((c, index) => (
                <ComplaintRow
                  key={c._id}
                  c={c}
                  isAdmin={isAdmin}
                  updateStatus={updateStatus}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
