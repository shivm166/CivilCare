import React from "react";
import {
  FileText,
  Building,
  Home,
  DollarSign,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  Power,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const RuleCard = ({
  rule,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getRuleTypeLabel = (type) => {
    const labels = {
      general: "General Rule",
      building_specific: "Building Specific",
      bhk_specific: "BHK Type Specific",
    };
    return labels[type] || type;
  };

  const getRuleTypeBadgeColor = (type) => {
    const colors = {
      general: "bg-blue-100 text-blue-700 border-blue-200",
      building_specific: "bg-purple-100 text-purple-700 border-purple-200",
      bhk_specific: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getPenaltyTypeLabel = (type) => {
    const labels = {
      percentage: "Percentage",
      fixed: "Fixed Amount",
      daily: "Daily Charge",
    };
    return labels[type] || type;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAmountDisplay = () => {
    if (rule.amountType === "flat") {
      return formatAmount(rule.amount);
    } else {
      const amounts = rule.bhkWiseAmounts;
      return (
        <div className="space-y-0.5">
          {amounts?.["1bhk"] > 0 && (
            <div className="text-[10px] sm:text-xs">
              <span className="text-gray-600">1 BHK:</span>{" "}
              <span className="font-semibold">{formatAmount(amounts["1bhk"])}</span>
            </div>
          )}
          {amounts?.["2bhk"] > 0 && (
            <div className="text-[10px] sm:text-xs">
              <span className="text-gray-600">2 BHK:</span>{" "}
              <span className="font-semibold">{formatAmount(amounts["2bhk"])}</span>
            </div>
          )}
          {amounts?.["3bhk"] > 0 && (
            <div className="text-[10px] sm:text-xs">
              <span className="text-gray-600">3 BHK:</span>{" "}
              <span className="font-semibold">{formatAmount(amounts["3bhk"])}</span>
            </div>
          )}
          {amounts?.penthouse > 0 && (
            <div className="text-[10px] sm:text-xs">
              <span className="text-gray-600">Penthouse:</span>{" "}
              <span className="font-semibold">{formatAmount(amounts.penthouse)}</span>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 sm:p-2.5">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <FileText className="text-white flex-shrink-0" size={14} />
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                {rule.ruleName}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1">
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getRuleTypeBadgeColor(
                  rule.ruleType
                )} bg-white`}
              >
                {getRuleTypeLabel(rule.ruleType)}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                  rule.isActive
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                } bg-white`}
              >
                {rule.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            onClick={onToggleExpand}
            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Card Body - Basic Info */}
      <div className="p-2 sm:p-2.5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Amount Display */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 rounded border border-green-200">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <div className="flex items-center gap-1">
                <DollarSign className="text-green-600 flex-shrink-0" size={12} />
                <span className="text-[10px] font-medium text-gray-600">
                  {rule.amountType === "flat" ? "Amount" : "BHK-wise"}
                </span>
              </div>
            </div>
            <div className="text-sm lg:text-base font-bold text-gray-800">
              {getAmountDisplay()}
            </div>
          </div>

          {/* Billing & Penalty Info - Side by Side on Mobile, Grid on Desktop */}
          <div className="grid grid-cols-2 lg:col-span-2 lg:grid-cols-2 gap-2">
            {/* Billing Info */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-2 rounded border border-blue-200">
              <div className="flex items-center gap-1 mb-0.5">
                <Calendar className="text-blue-600 flex-shrink-0" size={12} />
                <span className="text-[10px] font-medium text-gray-600">Billing</span>
              </div>
              <div className="text-sm lg:text-base font-bold text-gray-800">
                {rule.billingDay}
                {rule.billingDay === 1
                  ? "st"
                  : rule.billingDay === 2
                  ? "nd"
                  : rule.billingDay === 3
                  ? "rd"
                  : "th"}
              </div>
              <div className="text-[10px] text-gray-500">
                Due: {rule.dueDays}d
              </div>
            </div>

            {/* Penalty Info */}
            <div
              className={`p-2 rounded border ${
                rule.penaltyEnabled
                  ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <AlertCircle
                  className={rule.penaltyEnabled ? "text-red-600" : "text-gray-400"}
                  size={12}
                />
                <span className="text-[10px] font-medium text-gray-600">
                  Penalty
                </span>
              </div>
              {rule.penaltyEnabled ? (
                <>
                  <div className="text-sm lg:text-base font-bold text-gray-800">
                    {rule.penaltyType === "percentage"
                      ? `${rule.penaltyValue}%`
                      : formatAmount(rule.penaltyValue)}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {getPenaltyTypeLabel(rule.penaltyType)}
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-500">No Penalty</div>
              )}
            </div>
          </div>
        </div>

        {/* Building & BHK Info */}
        {(rule.building || rule.bhkTypes?.length > 0) && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {rule.building && (
                <div className="flex items-start gap-1">
                  <Building className="text-orange-500 mt-0.5 flex-shrink-0" size={12} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500">Building</p>
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {rule.building?.name || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {rule.bhkTypes?.length > 0 && (
                <div className="flex items-start gap-1">
                  <Home className="text-orange-500 mt-0.5 flex-shrink-0" size={12} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500">BHK Types</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {rule.bhkTypes.map((bhk) => (
                        <span
                          key={bhk}
                          className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] rounded-full font-medium"
                        >
                          {bhk.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-200 space-y-2">
            {/* Description */}
            {rule.description && (
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                  Description
                </p>
                <p className="text-xs text-gray-700">{rule.description}</p>
              </div>
            )}
            
            {/* Metadata */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 text-[10px] text-gray-500">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(rule.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              {rule.createdBy && (
                <div className="truncate">
                  <span className="font-medium">Created By:</span>{" "}
                  {rule.createdBy?.name || "Admin"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-200">
          <button
            onClick={() => onEdit(rule)}
            className="flex-1 lg:flex-initial lg:min-w-[90px] flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all text-[10px] lg:text-xs font-medium shadow-sm hover:shadow"
          >
            <Edit size={12} className="lg:w-3.5 lg:h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onToggleStatus(rule._id)}
            className={`flex-1 lg:flex-initial lg:min-w-[90px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all text-[10px] lg:text-xs font-medium shadow-sm hover:shadow ${
              rule.isActive
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
            }`}
          >
            <Power size={12} className="lg:w-3.5 lg:h-3.5" />
            <span>{rule.isActive ? "Off" : "On"}</span>
          </button>

          <button
            onClick={() => onDelete(rule._id)}
            className="flex-1 lg:flex-initial lg:min-w-[90px] flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all text-[10px] lg:text-xs font-medium shadow-sm hover:shadow"
          >
            <Trash2 size={12} className="lg:w-3.5 lg:h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuleCard;