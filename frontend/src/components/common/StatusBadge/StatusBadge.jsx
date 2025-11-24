// frontend/src/components/common/StatusBadge/StatusBadge.jsx
import React from "react";
import {
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";

/**
 * Reusable Status/Priority Badge Component.
 * @param {object} props
 * @param {'pending' | 'in_progress' | 'resolved' | 'closed' | 'low' | 'medium' | 'high'} props.type
 * @param {boolean} [props.compact=false] - Smaller padding/font size.
 * @param {boolean} [props.isPulse=false] - Apply pulsing animation.
 */
const StatusBadge = ({
  type,
  compact = false,
  isPulse = false,
  className = "",
}) => {
  let style = "";
  let icon = null;
  let text = type.replace(/_/g, " ");

  const baseStyle = `inline-flex items-center gap-1.5 font-semibold rounded-full border transition-colors ${className} ${
    isPulse ? "animate-pulse" : ""
  }`;

  switch (type) {
    case "pending":
    case "low":
      style = "bg-amber-100 text-amber-800 border-amber-300";
      icon = <Clock />;
      break;
    case "in_progress":
    case "medium":
      style = "bg-blue-100 text-blue-800 border-blue-300";
      icon = <Wrench />;
      break;
    case "resolved":
    case "high":
      style = "bg-green-100 text-green-800 border-green-300";
      icon = <CheckCircle2 />;
      break;
    case "closed":
      style = "bg-gray-100 text-gray-800 border-gray-300";
      icon = <AlertCircle />;
      break;
    default:
      style = "bg-gray-100 text-gray-600 border-gray-200";
      icon = <Zap />;
  }

  const sizeStyle = compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  const iconSize = compact ? "w-3 h-3" : "w-4 h-4";

  return (
    <span className={`${baseStyle} ${sizeStyle} ${style}`}>
      {icon && React.cloneElement(icon, { className: iconSize })}
      <span className="capitalize">{text}</span>
    </span>
  );
};

export default StatusBadge;
