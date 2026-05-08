import React from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const FundsSummaryCard = ({ fund, isAdmin = false }) => {
  if (!fund) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No fund data available</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Balance",
      value: fund.totalBalance,
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Maintenance Collected",
      value: fund.totalMaintenanceCollected,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Penalty Collected",
      value: fund.totalPenaltyCollected,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Total Withdrawals",
      value: fund.totalWithdrawals,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Society Fund Summary</h2>
            <p className="text-sm text-blue-100">
              Financial overview and balance
            </p>
          </div>
        </div>
      </div>

      {/* Main Balance */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Current Balance</p>
          <p className="text-4xl font-bold text-blue-600">
            ₹{fund.totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.slice(1).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>
                    ₹{stat.value.toLocaleString()}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Last Updated */}
      {fund.lastTransactionDate && (
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            Last updated:{" "}
            {new Date(fund.lastTransactionDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default FundsSummaryCard;
