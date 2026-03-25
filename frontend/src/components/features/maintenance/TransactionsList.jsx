import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FileText,
} from "lucide-react";

const TransactionsList = ({ transactions, isAdmin = false }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No transactions found</p>
      </div>
    );
  }

  const getCategoryLabel = (category) => {
    const labels = {
      maintenance_payment: "Maintenance Payment",
      penalty_payment: "Penalty Payment",
      admin_withdrawal: "Admin Withdrawal",
    };
    return labels[category] || category;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" />
          Recent Transactions
        </h3>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Side */}
              <div className="flex items-start gap-3 flex-1">
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg ${
                    transaction.transactionType === "incoming"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.transactionType === "incoming" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {getCategoryLabel(transaction.category)}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5 truncate">
                    {transaction.description}
                  </p>

                  {/* User Info */}
                  {transaction.user && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{transaction.user.name}</span>
                    </div>
                  )}

                  {/* Withdrawn By (for admin withdrawals) */}
                  {transaction.withdrawnBy && isAdmin && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>Withdrawn by: {transaction.withdrawnBy.name}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(transaction.transactionDate)}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Amount */}
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.transactionType === "incoming"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.transactionType === "incoming" ? "+" : "-"}₹
                  {transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Balance: ₹{transaction.balanceAfter.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Withdrawal Reason (Admin only) */}
            {transaction.withdrawalReason && isAdmin && (
              <div className="mt-3 bg-gray-50 rounded p-2 border border-gray-200">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Reason:</span>{" "}
                  {transaction.withdrawalReason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsList;
