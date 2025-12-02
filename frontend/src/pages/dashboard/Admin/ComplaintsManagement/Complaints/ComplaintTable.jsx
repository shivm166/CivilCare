import React from "react";
<<<<<<< HEAD
import {
  Wrench,
  User,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  ListTodo,
  Flame,
  Triangle,
  Droplet,
  Loader2,
} from "lucide-react";
=======
<<<<<<< HEAD
import { Wrench, User, Clock, Zap, CheckCircle2, XCircle } from "lucide-react";
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
import Button from "../../../../../components/common/Button/Button";
import StatusBadge from "../../../../../components/common/StatusBadge/StatusBadge";

const actionMap = {
  pending: { icon: Clock, label: "Set Pending", variant: "secondary" },
  in_progress: { icon: Zap, label: "Start Work", variant: "primary" },
  resolved: { icon: CheckCircle2, label: "Mark Resolved", variant: "success" },
  closed: { icon: XCircle, label: "Close Issue", variant: "ghost" },
};

// PRIORITY ACCENT & DETAILS

const getPriorityAccentClass = (priority) => {
  switch (priority) {
    case "high":
      return "border-l-red-500 hover:shadow-red-100/50";
    case "medium":
      return "border-l-amber-500 hover:shadow-amber-100/50";
    case "low":
      return "border-l-green-500 hover:shadow-green-100/50";
    default:
      return "border-l-gray-300 hover:shadow-gray-100/50";
  }
};

const getPriorityDetails = (priority) => {
  const map = {
    high: { icon: Flame, color: "text-red-500" },
    medium: { icon: Triangle, color: "text-amber-500" },
    low: { icon: Droplet, color: "text-green-500" },
  };
  return map[priority] || { icon: Zap, color: "text-gray-500" };
};

export const ComplaintsHeader = ({
  title,
  subtitle,
  icon: Icon = ListTodo,
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-3">
<<<<<<< HEAD
      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl flex-shrink-0">
=======
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
=======
import {
  Wrench,
  User,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  ListTodo,
  Flame,
  Triangle,
  Droplet,
  Loader2,
} from "lucide-react";
import Button from "../../../../../components/common/Button/Button";
import StatusBadge from "../../../../../components/common/StatusBadge/StatusBadge";

const actionMap = {
  pending: { icon: Clock, label: "Set Pending", variant: "secondary" },
  in_progress: { icon: Zap, label: "Start Work", variant: "primary" },
  resolved: { icon: CheckCircle2, label: "Mark Resolved", variant: "success" },
  closed: { icon: XCircle, label: "Close Issue", variant: "ghost" },
};

// PRIORITY ACCENT & DETAILS

const getPriorityAccentClass = (priority) => {
  switch (priority) {
    case "high":
      return "border-l-red-500 hover:shadow-red-100/50";
    case "medium":
      return "border-l-amber-500 hover:shadow-amber-100/50";
    case "low":
      return "border-l-green-500 hover:shadow-green-100/50";
    default:
      return "border-l-gray-300 hover:shadow-gray-100/50";
  }
};

const getPriorityDetails = (priority) => {
  const map = {
    high: { icon: Flame, color: "text-red-500" },
    medium: { icon: Triangle, color: "text-amber-500" },
    low: { icon: Droplet, color: "text-green-500" },
  };
  return map[priority] || { icon: Zap, color: "text-gray-500" };
};

export const ComplaintsHeader = ({
  title,
  subtitle,
  icon: Icon = ListTodo,
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl flex-shrink-0">
>>>>>>> maintenance
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
        <Icon className="text-white w-6 h-6" />
      </div>

      <div>
<<<<<<< HEAD
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {title}
        </h1>
        {subtitle && <p className="text-base text-gray-600 mt-1">{subtitle}</p>}
=======
<<<<<<< HEAD
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
=======
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {title}
        </h1>
        {subtitle && <p className="text-base text-gray-600 mt-1">{subtitle}</p>}
>>>>>>> maintenance
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
      </div>
    </div>
  </div>
);

export const EmptyState = ({ isAdmin }) => (
  <div className="text-center py-16">
<<<<<<< HEAD
    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
=======
<<<<<<< HEAD
    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
      <Wrench className="w-8 h-8 text-gray-400" />
    </div>

    <h3 className="text-xl font-bold mt-4 text-gray-800">
      No Complaints Found
    </h3>
    <p className="text-gray-500 mt-2">
      {isAdmin
<<<<<<< HEAD
        ? "No issues have been submitted to your society yet."
=======
        ? "No complaints submitted yet."
=======
    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Wrench className="w-8 h-8 text-gray-400" />
    </div>

    <h3 className="text-xl font-bold mt-4 text-gray-800">
      No Complaints Found
    </h3>
    <p className="text-gray-500 mt-2">
      {isAdmin
        ? "No issues have been submitted to your society yet."
>>>>>>> maintenance
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
        : "You haven't raised any complaints yet."}
    </p>
  </div>
);

<<<<<<< HEAD
// COMPLAINT CARD

const ComplaintCard = ({
=======
<<<<<<< HEAD
const ComplaintRow = ({
=======
// COMPLAINT CARD

const ComplaintCard = ({
>>>>>>> maintenance
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
  complaint,
  index,
  isAdmin,
  onUpdateStatus,
  isUpdating,
}) => {
<<<<<<< HEAD
  const accentClass = getPriorityAccentClass(complaint.priority);
  const { icon: PriorityIcon, color: PriorityColor } = getPriorityDetails(
    complaint.priority
  );

  const isUpdatingThisComplaint = isUpdating.id === complaint._id;
=======
<<<<<<< HEAD
  const activeStatusClass = getStatusAccent(complaint.status);
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b

  return (
    <div
      key={complaint._id}
      className={`
        p-4 sm:p-5 bg-gray-200 border-4-4 rounded-xl shadow-lg
        transition-all duration-200 ease-in-out
        hover:shadow-xl hover:border-l-8
        ${accentClass}
      `}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] lg:grid-cols-4 gap-4 items-center">
        <div className="lg:col-span-2 flex items-start gap-4 min-w-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white bg-black flex-shrink-0 mt-1">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            {/* Title */}
            <p className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
              <span className="text-indigo-900 font-bold">Title : </span>
              {complaint.title}
            </p>
            {/* Description */}
            {complaint.description && (
<<<<<<< HEAD
=======
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
=======
  const accentClass = getPriorityAccentClass(complaint.priority);
  const { icon: PriorityIcon, color: PriorityColor } = getPriorityDetails(
    complaint.priority
  );

  const isUpdatingThisComplaint = isUpdating.id === complaint._id;

  return (
    <div
      key={complaint._id}
      className={`
        p-4 sm:p-5 bg-gray-200 border-4-4 rounded-xl shadow-lg
        transition-all duration-200 ease-in-out
        hover:shadow-xl hover:border-l-8
        ${accentClass}
      `}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] lg:grid-cols-4 gap-4 items-center">
        <div className="lg:col-span-2 flex items-start gap-4 min-w-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white bg-black flex-shrink-0 mt-1">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            {/* Title */}
            <p className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
              <span className="text-indigo-900 font-bold">Title : </span>
              {complaint.title}
            </p>
            {/* Description */}
            {complaint.description && (
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
              <p className="text-sm text-black line-clamp-2">
                <span className="text-indigo-900 font-bold">
                  Description :{" "}
                </span>
<<<<<<< HEAD
=======
>>>>>>> maintenance
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
                {complaint.description}
              </p>
            )}

<<<<<<< HEAD
            {/* Reporter (Admin View) */}
            {isAdmin && complaint.createdBy?.name && (
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-black">
                <User className="w-3 h-3 text-indigo-500" />
                <span className="font-bold">
                  Reported by: {complaint.createdBy.name}
=======
<<<<<<< HEAD
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
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Status & Priority & Date */}
        <div className="flex flex-col gap-2 md:gap-1 items-start md:items-center lg:justify-center">
          <StatusBadge
            type={complaint.status}
            isPulse={
              complaint.status === "pending" ||
              complaint.status === "in_progress"
            }
          />

          <div className="flex items-center gap-1 text-xs font-medium text-black">
            <PriorityIcon className={`w-3 h-3 ${PriorityColor}`} />
            <span className="capitalize">{complaint.priority}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-black">
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
<<<<<<< HEAD
=======
      </td>
    </tr>
=======
            {/* Reporter (Admin View) */}
            {isAdmin && complaint.createdBy?.name && (
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-black">
                <User className="w-3 h-3 text-indigo-500" />
                <span className="font-bold">
                  Reported by: {complaint.createdBy.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Status & Priority & Date */}
        <div className="flex flex-col gap-2 md:gap-1 items-start md:items-center lg:justify-center">
          <StatusBadge
            type={complaint.status}
            isPulse={
              complaint.status === "pending" ||
              complaint.status === "in_progress"
            }
          />

          <div className="flex items-center gap-1 text-xs font-medium text-black">
            <PriorityIcon className={`w-3 h-3 ${PriorityColor}`} />
            <span className="capitalize">{complaint.priority}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-black">
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
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b

        {/* Column 3: Actions (Admin Only) */}
        {isAdmin && (
          <div className="lg:col-span-1 md:col-span-2 flex flex-wrap gap-2 justify-start md:justify-end">
            {Object.entries(actionMap).map(([key, action]) => {
              const isActive = complaint.status === key;
              const isStatusUpdatingThisButton =
                isUpdatingThisComplaint && isUpdating.statusKey === key;

              const buttonVariant =
                action.variant === "info " ? "indigo" : action.variant;

              if (isActive) return null;

              return (
                <Button
                  key={key}
                  size="xl"
                  variant={buttonVariant}
                  disabled={isUpdatingThisComplaint}
                  onClick={() =>
                    onUpdateStatus({ id: complaint._id, status: key })
                  }
                  className="min-w-[15px] justify-center "
                >
                  {isStatusUpdatingThisButton ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <action.icon className="w-4 h-4 mr-2" />
                  )}
                  {isStatusUpdatingThisButton ? "Updating..." : action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
<<<<<<< HEAD
=======
>>>>>>> maintenance
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
  );
};

export const ComplaintTable = ({
  complaints = [],
  isAdmin = false,
  onUpdateStatus,
<<<<<<< HEAD
  isUpdating = { id: null, statusKey: null },
=======
<<<<<<< HEAD
  isUpdating = false,
=======
  isUpdating = { id: null, statusKey: null },
>>>>>>> maintenance
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
}) => {
  if (!complaints || complaints.length === 0) return null;

  return (
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
    <div className="space-y-4">
      {complaints.map((c, i) => (
        <ComplaintCard
          key={c._id}
          complaint={c}
          index={i}
          isAdmin={isAdmin}
          onUpdateStatus={onUpdateStatus}
          isUpdating={isUpdating}
        />
      ))}
<<<<<<< HEAD
=======
>>>>>>> maintenance
>>>>>>> ba0e0d00f5de3cd953d9ce991e4ee50ba7b0f43b
    </div>
  );
};

export default ComplaintTable;
