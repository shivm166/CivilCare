import React, { useState } from "react";
import {
  Wallet,
  TrendingDown,
  Users,
  Receipt,
  Filter,
  Plus,
  Calendar,
} from "lucide-react";
import {
  useFundSummary,
  useTransactions,
  useMemberPaymentStatus,
  useWithdrawFunds,
  useGenerateBills,
} from "../../../../hooks/api/usemaintenance";
import FundsSummaryCard from "../../../../components/features/maintenance/FundsSummaryCard";
import TransactionsList from "../../../../components/features/maintenance/TransactionsList";
import WithdrawFundModal from "../../../../components/features/maintenance/WithdrawFundModal";
import GenerateBillsModal from "../../../../components/features/maintenance/GenerateBillsModal";

const FundsManagementPage = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showGenerateBillsModal, setShowGenerateBillsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    status: "",
  });

  const { data: fundData, isLoading: loadingFund } = useFundSummary();
  const { data: transactionsData, isLoading: loadingTransactions } =
    useTransactions();
  const { data: memberStatusData, isLoading: loadingMembers } =
    useMemberPaymentStatus(filters);
  const { mutate: withdrawFunds, isPending: isWithdrawing } =
    useWithdrawFunds();
  const { mutate: generateBills, isPending: isGenerating } =
    useGenerateBills();

  const handleWithdraw = (withdrawalData) => {
    withdrawFunds(withdrawalData, {
      onSuccess: () => {
        setShowWithdrawModal(false);
      },
    });
  };

  const handleGenerateBills = (billData) => {
    generateBills(billData, {
      onSuccess: () => {
        setShowGenerateBillsModal(false);
      },
    });
  };

  const fund = fundData?.fund;
  const transactions = transactionsData?.transactions || [];
  const members = memberStatusData?.members || [];

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
        return "Paid";
      case "overdue":
        return "Overdue";
      case "partially_paid":
        return "Partial";
      default:
        return "Pending";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Wallet className="h-8 w-8 text-blue-600" />
              Society Fund Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage society funds, transactions, and member payments
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowGenerateBillsModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-md"
            >
              <Plus className="h-5 w-5" />
              Generate Bills
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-md"
            >
              <TrendingDown className="h-5 w-5" />
              Withdraw Funds
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "transactions"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Transactions
              </div>
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "members"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Member Status
              </div>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="p-6">
            {loadingFund ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <FundsSummaryCard fund={fund} isAdmin={true} />

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fundData?.billsStats?.map((stat) => (
                    <div
                      key={stat._id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 capitalize">
                            {stat._id} Bills
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {stat.count}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ₹{stat.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            stat._id
                          )}`}
                        >
                          {getStatusText(stat._id)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Transactions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Transactions
                  </h3>
                  <TransactionsList
                    transactions={transactions.slice(0, 10)}
                    isAdmin={true}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="p-6">
            {loadingTransactions ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Filters */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Filter Transactions
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Types</option>
                      <option value="incoming">Incoming</option>
                      <option value="outgoing">Outgoing</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Categories</option>
                      <option value="maintenance_payment">Maintenance</option>
                      <option value="penalty_payment">Penalty</option>
                      <option value="admin_withdrawal">Withdrawal</option>
                    </select>
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="End Date"
                    />
                  </div>
                </div>

                <TransactionsList transactions={transactions} isAdmin={true} />
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="p-6">
            {loadingMembers ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Filters */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Filter Members
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                      <option value="partially_paid">Partially Paid</option>
                    </select>
                    <select
                      value={filters.month}
                      onChange={(e) =>
                        setFilters({ ...filters, month: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Months</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2024, i).toLocaleString("en-IN", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filters.year}
                      onChange={(e) =>
                        setFilters({ ...filters, year: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Years</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                  </div>
                </div>

                {/* Members List */}
                {members.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Member
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Penalty
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {members.map((member) => (
                            <tr
                              key={member._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {member.user?.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {member.user?.email}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    {member.unit?.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {member.building?.name}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm font-semibold text-gray-900">
                                  ₹{member.baseAmount.toLocaleString()}
                                </p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {member.penaltyAmount > 0 ? (
                                  <p className="text-sm font-semibold text-red-600">
                                    ₹{member.penaltyAmount.toLocaleString()}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-500">-</p>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                    member.status
                                  )}`}
                                >
                                  {getStatusText(member.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(member.dueDate).toLocaleDateString(
                                  "en-IN"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      No member data available
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Generate bills to see member payment status
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <WithdrawFundModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        availableBalance={fund?.totalBalance || 0}
        onConfirm={handleWithdraw}
        isProcessing={isWithdrawing}
      />

      <GenerateBillsModal
        isOpen={showGenerateBillsModal}
        onClose={() => setShowGenerateBillsModal(false)}
        onGenerate={handleGenerateBills}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default FundsManagementPage;
