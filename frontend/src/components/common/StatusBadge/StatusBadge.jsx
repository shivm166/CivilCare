import React from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  XCircle,
  AlertTriangle,
  Flame,
  ThumbsUp,
} from "lucide-react";

const StatusBadge = ({
  type,
  compact = false,
  isPulse = false,
  className = "",
}) => {
  let style = "";
  let IconComponent = null;
  let text = type.replace(/_/g, " ");

  const baseStyle = `inline-flex items-center gap-1.5 font-semibold rounded-full border transition-all duration-300 ${className} ${
    isPulse ? "animate-pulse shadow-md" : ""
  }`;

  const sizeStyle = compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  const iconSize = compact ? "w-3 h-3" : "w-4 h-4";

  switch (type) {
    // compaint status
    case "pending":
      style = "bg-indigo-50 border-indigo-300 text-indigo-700";
      IconComponent = Clock;
      break;
    case "in_progress":
      style = "bg-blue-50 border-blue-300 text-blue-700";
      IconComponent = Zap;
      break;
    case "resolved":
      style = "bg-green-50 border-green-300 text-green-700";
      IconComponent = CheckCircle2;
      break;
    case "closed":
      style = "bg-gray-200 border-gray-400 text-gray-700";
      IconComponent = XCircle;
      break;

    // status
    case "low":
      style = "bg-green-50 border-green-300 text-green-700";
      IconComponent = ThumbsUp;
      break;
    case "medium":
      style = "bg-amber-50 border-amber-300 text-amber-700";
      IconComponent = AlertTriangle;
      break;
    case "high":
      style = "bg-red-50 border-red-300 text-red-700";
      IconComponent = Flame;

    default:
      style = "bg-gray-100 border-gray-300 text-gray-600";
      IconComponent = AlertCircle;
  }

  if (!IconComponent) IconComponent = AlertCircle;

  return (
    <span className={`${baseStyle} ${sizeStyle} ${style}`}>
      <IconComponent className={iconSize} />
      <span className="capitalize">{text}</span>
    </span>
  );
};

export default StatusBadge;
