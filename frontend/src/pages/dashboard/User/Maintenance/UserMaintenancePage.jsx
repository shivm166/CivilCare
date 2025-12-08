import React from "react";
import {
  DollarSign,
  Calendar,
  AlertCircle,
  Building2,
  Home,
  Info,
  Clock,
} from "lucide-react";
import {
  useMyApplicableMaintenance,
  useMyMaintenanceBills,
} from "../../../../hooks/api/useMaintenance";

const UserMaintenancePage = () => {
  const { data: applicableData, isLoading: loadingApplicable } =
    useMyApplicableMaintenance();
  const { data: billsData, isLoading: loadingBills } = useMyMaintenanceBills();

  if (loadingApplicable || loadingBills) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-orange-500 mx-auto mb-2 sm:mb-3"></div>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">Loading your maintenance info...</p>
        </div>
      </div>
    );
  }

  const { hasUnit, unit, maintenance } = applicableData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-2 sm:p-3 lg:p-4">
      <div className="w-full space-y-2.5 sm:space-y-3">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-2.5 sm:p-3 lg:p-4 text-white shadow-md">
          <h1 className="text-base sm:text-xl lg:text-2xl font-bold mb-0.5 sm:mb-1">My Maintenance</h1>
          <p className="text-orange-100 text-[10px] sm:text-xs">
            View your maintenance charges and payment history
          </p>
        </div>

        {/* No Unit Assigned */}
        {!hasUnit && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2.5 sm:p-3 lg:p-4 rounded-lg shadow-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <h3 className="font-semibold text-yellow-800 text-xs sm:text-sm">
                  No Unit Assigned
                </h3>
                <p className="text-yellow-700 text-[10px] sm:text-xs mt-0.5">
                  You don't have any unit assigned yet. Please contact your
                  society admin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unit Info & Applicable Maintenance */}
        {hasUnit && (
          <>
            {/* Unit Information Card */}
            <div className="bg-white rounded-lg shadow-md p-2.5 sm:p-3 lg:p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">Your Unit</h2>
                <Home className="text-orange-600 flex-shrink-0" size={16} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5 p-2 bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg border border-orange-100">
                  <Building2 className="text-orange-600 flex-shrink-0" size={14} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500">Building</p>
                    <p className="font-semibold text-gray-800 text-xs truncate">
                      {unit.building || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <Home className="text-blue-600 flex-shrink-0" size={14} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500">Unit</p>
                    <p className="font-semibold text-gray-800 text-xs truncate">{unit.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <Info className="text-purple-600 flex-shrink-0" size={14} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500">Type</p>
                    <p className="font-semibold text-gray-800 text-xs uppercase truncate">
                      {unit.bhkType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicable Maintenance Amount */}
            {maintenance ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-5 border-2 border-green-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
                    Your Maintenance Amount
                  </h2>
                  <DollarSign className="text-green-600 flex-shrink-0" size={20} />
                </div>

                {/* Amount Display */}
                <div className="bg-white rounded-lg p-4 sm:p-6 mb-3 sm:mb-4 shadow-sm border border-green-200">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Monthly Amount</p>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600">
                      ₹{maintenance.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Rule Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-white rounded-lg border border-green-100">
                    <Calendar className="text-blue-600 flex-shrink-0" size={16} />
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-500">Billing Day</p>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                        {maintenance.billingDay}
                        {["th", "st", "nd", "rd"][
                          maintenance.billingDay > 3
                            ? 0
                            : maintenance.billingDay
                        ]}{" "}
                        of month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-white rounded-lg border border-green-100">
                    <Clock className="text-orange-600 flex-shrink-0" size={16} />
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-500">Payment Due</p>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                        Within {maintenance.dueDays} days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Penalty Info */}
                {maintenance.penaltyEnabled && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-2.5 sm:p-3 rounded mb-3 sm:mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={14} />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-red-800">
                          Late Payment Penalty
                        </p>
                        <p className="text-xs text-red-700 mt-0.5">
                          {maintenance.penaltyType === "percentage"
                            ? `${maintenance.penaltyValue}% of base amount`
                            : maintenance.penaltyType === "fixed"
                            ? `₹${maintenance.penaltyValue} fixed charge`
                            : `₹${maintenance.penaltyValue} per day`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rule Info */}
                <div className="p-2.5 sm:p-3 bg-white rounded-lg border border-green-100">
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Applied Rule</p>
                  <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                    {maintenance.rule.name}
                  </p>
                  {maintenance.rule.description && (
                    <p className="text-xs text-gray-600 mt-1 sm:mt-2">
                      {maintenance.rule.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-5 rounded-lg shadow-md">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Info className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="font-semibold text-yellow-800 text-sm sm:text-base">
                      No Maintenance Rule Applied
                    </h3>
                    <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                      No maintenance rules are currently applied to your unit.
                      Contact admin for details.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserMaintenancePage;