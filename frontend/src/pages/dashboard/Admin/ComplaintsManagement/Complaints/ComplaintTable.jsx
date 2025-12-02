import React from "react";
import { Wrench, User, Clock, Zap, CheckCircle2, XCircle } from "lucide-react";
import Button from "../../../../../components/common/Button/Button";
import StatusBadge from "../../../../../components/common/StatusBadge/StatusBadge";

// =====================================================
// ACTION BUTTON MAP
// =====================================================
const actionMap = {
  pending: { icon: Clock, label: "Pending", variant: "secondary" },
  in_progress: { icon: Zap, label: "In Progress", variant: "primary" },
  resolved: { icon: CheckCircle2, label: "Resolved", variant: "success" },
  closed: { icon: XCircle, label: "Closed", variant: "ghost" },
};

// =====================================================
// STATUS ACCENT (used only for active/selected status)
// =====================================================
const getStatusAccent = (status) => {
  switch (status) {
    case "pending":
      return "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white";
    case "in_progress":
      return "bg-gradient-to-r from-blue-600 to-blue-500 text-white";
    case "resolved":
      return "bg-gradient-to-r from-green-500 to-green-400 text-white";
    case "closed":
      return "bg-gradient-to-r from-gray-600 to-gray-500 text-white";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// =====================================================
// HEADER
// =====================================================
export const ComplaintsHeader = ({ title, subtitle, icon: Icon = Wrench }) => (
  <div className="mb-6 sm:mb-10">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
        <Icon className="text-white w-6 h-6" />
      </div>

      <div>
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export const EmptyState = ({ isAdmin }) => (
  <div className="text-center py-16">
    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
      <Wrench className="w-8 h-8 text-gray-400" />
    </div>

    <h3 className="text-xl font-bold mt-4">No Complaints Found</h3>
    <p className="text-gray-500 mt-2">
      {isAdmin
        ? "No complaints submitted yet."
        : "You haven't raised any complaints yet."}
    </p>
  </div>
);

const ComplaintRow = ({
  complaint,
  index,
  isAdmin,
  onUpdateStatus,
  isUpdating,
}) => {
  const activeStatusClass = getStatusAccent(complaint.status);

  return (
    <tr className="border-b last:border-b-0">
      {/* INDEX + ISSUE */}
      <td className="p-4 align-top">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-gray-800 bg-gray-100">
            {index + 1}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm">
              {complaint.title}
            </p>
            {complaint.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {complaint.description}
              </p>
            )}

            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              {complaint.createdBy && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">
                    {complaint.createdBy?.name}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-medium">
                  {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </td>

      {/* STATUS */}
      <td className="p-4 align-top text-center">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${activeStatusClass}`}
        >
          <StatusBadge type={complaint.status} compact hideText />
          <span className="ml-2 capitalize">
            {complaint.status.replace("_", " ")}
          </span>
        </div>
      </td>

      {/* PRIORITY */}
      <td className="p-4 align-top text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 font-semibold">
          <StatusBadge type={complaint.priority} compact />
        </div>
      </td>

      {/* ACTIONS */}
      <td className="p-4 align-top">
        <div className="flex justify-end items-center gap-2">
          {isAdmin ? (
            <div className="flex gap-2 flex-wrap justify-end">
              {Object.entries(actionMap).map(([key, action]) => {
                const isActive = complaint.status === key;

                return (
                  <Button
                    key={key}
                    size="sm"
                    variant={action.variant}
                    icon={action.icon}
                    onClick={() =>
                      onUpdateStatus?.({ id: complaint._id, status: key })
                    }
                    disabled={isUpdating || isActive}
                    isLoading={isUpdating && !isActive}
                    className={`min-w-[110px] !rounded-full ${
                      isActive ? "!bg-gray-800 text-white" : ""
                    }`}
                  >
                    <span className="font-semibold">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      </td>
    </tr>
  );
};

export const ComplaintTable = ({
  complaints = [],
  isAdmin = false,
  onUpdateStatus,
  isUpdating = false,
}) => {
  if (!complaints || complaints.length === 0) return null;

  return (
    <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-left w-[45%]">Issue & Reporter</th>
            <th className="p-4 text-center w-[20%]">Status</th>
            <th className="p-4 text-center w-[15%]">Priority</th>
            <th className="p-4 text-right w-[20%]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c, i) => (
            <ComplaintRow
              key={c._id}
              complaint={c}
              index={i}
              isAdmin={isAdmin}
              onUpdateStatus={onUpdateStatus}
              isUpdating={isUpdating}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
