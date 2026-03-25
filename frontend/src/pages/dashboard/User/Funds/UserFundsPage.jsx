import React from "react";
import { Wallet, TrendingUp, Info } from "lucide-react";
import { useUserFundSummary } from "../../../../hooks/api/usemaintenance";
import FundsSummaryCard from "../../../../components/features/maintenance/FundsSummaryCard";
import TransactionsList from "../../../../components/features/maintenance/TransactionsList";

const UserFundsPage = () => {
  const { data: fundData, isLoading } = useUserFundSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading fund information...</p>
        </div>
      </div>
    );
  }

  const fund = fundData?.fund;
  const transactions = fundData?.transactions || [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Wallet className="h-8 w-8 text-blue-600" />
              Society Funds
            </h1>
            <p className="text-gray-600 mt-2">
              View society fund balance and transactions
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Transparency Notice</p>
            <p className="mt-1">
              All society members can view fund information for transparency. Only admins can withdraw funds for society expenses.
            </p>
          </div>
        </div>
      </div>

      {/* Fund Summary */}
      <FundsSummaryCard fund={fund} isAdmin={false} />

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Transactions
            </h2>
          </div>
          <TransactionsList transactions={transactions} isAdmin={false} />
        </div>
      )}

      {/* Empty State */}
      {(!fund || transactions.length === 0) && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No fund information available</p>
          <p className="text-sm text-gray-500 mt-2">
            Fund information will appear here once bills are generated
          </p>
        </div>
      )}
    </div>
  );
};

export default UserFundsPage;
