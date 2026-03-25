import React from "react";
import {
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Lock,
  AlertTriangle,
} from "lucide-react";

const MaintenanceBillCard = ({ bill, onPayClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      case "partially_paid":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Fully Paid";
      case "overdue":
        return "Overdue";
      case "partially_paid":
        return "Partially Paid";
      default:
        return "Pending";
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = bill.status !== "paid" && new Date() > new Date(bill.dueDate);
  const hasPenalty = bill.penaltyAmount > 0;
  const isPenaltyUnpaid = hasPenalty && !bill.isPenaltyPaid;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
        bill.status === "paid" 
          ? "border-green-300" 
          : isOverdue 
          ? "border-red-300" 
          : "border-blue-200"
      }`}
    >
      {/* Header */}
      <div 
        className={`p-4 ${
          bill.status === "paid" 
            ? "bg-green-50" 
            : isOverdue 
            ? "bg-red-50" 
            : "bg-blue-50"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">
            {monthNames[bill.billingMonth - 1]} {bill.billingYear}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
              bill.status
            )}`}
          >
            {getStatusText(bill.status)}
          </span>
        </div>
        {bill.unit && bill.building && (
          <p className="text-sm text-gray-600 font-medium">
            {bill.unit?.name} • {bill.building?.name}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Base Amount */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-semibold">Base Amount</span>
          </div>
          <span className="font-bold text-lg text-gray-900">
            ₹{bill.baseAmount.toLocaleString()}
          </span>
        </div>

        {/* Penalty Amount */}
        {hasPenalty && (
          <div className="flex items-center justify-between pb-3 border-b-2 border-red-100">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Penalty</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-lg text-red-600">
                ₹{bill.penaltyAmount.toLocaleString()}
              </span>
              {bill.isPenaltyPaid && (
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Paid</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total Amount */}
        <div className="flex items-center justify-between pt-2 bg-gradient-to-r from-gray-50 to-gray-100 -mx-5 px-5 py-4 rounded-lg">
          <span className="font-bold text-gray-800">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">
            ₹{(bill.baseAmount + bill.penaltyAmount).toLocaleString()}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Due: {formatDate(bill.dueDate)}</span>
        </div>

        {/* Overdue Warning */}
        {isOverdue && bill.status !== "paid" && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-bold mb-1">⚠️ Payment Overdue!</p>
              <p className="text-xs leading-relaxed">
                {bill.daysOverdue > 0 && `${bill.daysOverdue} days overdue. `}
                Please pay immediately to avoid additional penalties.
              </p>
            </div>
          </div>
        )}

        {/* Penalty Payment Instruction */}
        {isPenaltyUnpaid && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-800 leading-relaxed">
              <p className="font-bold mb-1">Important:</p>
              <p>You must pay the penalty first before paying maintenance.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Payment Buttons */}
      {bill.status !== "paid" && (
        <div className="p-5 bg-gray-50 border-t-2 border-gray-200 space-y-3">
          {/* Penalty Payment Button */}
          {isPenaltyUnpaid && (
            <button
              onClick={() => onPayClick && onPayClick(bill, "penalty")}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              Pay Penalty ₹{bill.penaltyAmount.toLocaleString()} First
            </button>
          )}

          {/* Maintenance Payment Button */}
          {bill.isMaintenancePaid ? (
            <div className="bg-green-100 border-2 border-green-300 text-green-700 font-bold py-4 px-4 rounded-xl text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Maintenance Paid ✓
            </div>
          ) : isPenaltyUnpaid ? (
            <div className="bg-gray-200 border-2 border-gray-300 text-gray-500 font-semibold py-4 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-60">
              <Lock className="w-5 h-5" />
              Pay ₹{bill.baseAmount.toLocaleString()} - Locked
            </div>
          ) : (
            <button
              onClick={() => onPayClick && onPayClick(bill, "maintenance")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Pay Maintenance ₹{bill.baseAmount.toLocaleString()}
            </button>
          )}
        </div>
      )}

      {/* Fully Paid Status */}
      {bill.status === "paid" && (
        <div className="p-5 bg-green-50 border-t-2 border-green-200">
          <div className="flex items-center justify-center gap-3 text-green-700">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg">Payment Completed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceBillCard;
