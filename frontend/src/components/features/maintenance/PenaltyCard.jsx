import React from "react";
import { AlertTriangle, DollarSign, Calendar, Clock } from "lucide-react";

const PenaltyCard = ({ bill, onPayClick }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (bill.isPenaltyPaid || bill.penaltyAmount === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-md border-2 border-red-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Penalty Payment Required</h3>
            <p className="text-sm text-red-100">
              {monthNames[bill.billingMonth - 1]} {bill.billingYear}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Warning Message */}
        <div className="bg-red-100 border border-red-300 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-semibold">Payment Overdue!</p>
              <p className="mt-1">
                Your payment is {bill.daysOverdue} days overdue. You must pay
                the penalty first before paying maintenance.
              </p>
            </div>
          </div>
        </div>

        {/* Penalty Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Due Date</span>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{formatDate(bill.dueDate)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Days Overdue</span>
            <div className="flex items-center gap-2 text-red-600">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{bill.daysOverdue} days</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Penalty Type</span>
            <span className="font-medium text-gray-900 capitalize">
              {bill.maintenanceRule?.penaltyType?.replace("_", " ") || "N/A"}
            </span>
          </div>
        </div>

        {/* Penalty Amount */}
        <div className="bg-white rounded-lg p-4 border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Penalty Amount
              </span>
            </div>
            <span className="text-2xl font-bold text-red-600">
              ₹{bill.penaltyAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onPayClick(bill, "penalty")}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
        >
          <DollarSign className="h-5 w-5" />
          Pay Penalty Now
        </button>

        {/* Info Note */}
        <p className="text-xs text-gray-600 text-center">
          After paying the penalty, you can proceed with maintenance payment
        </p>
      </div>
    </div>
  );
};

export default PenaltyCard;
