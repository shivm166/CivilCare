import React, { useState } from "react";
import {
  DollarSign,
  Calendar,
  AlertCircle,
  Building2,
  Home,
  Info,
  Clock,
  Receipt,
  History,
} from "lucide-react";
import { useMyApplicableMaintenance } from "../../../../hooks/api/usemaintenance";
import {
  useMyBills,
  useCurrentBill,
  useProcessPayment,
  usePaymentHistory,
} from "../../../../hooks/api/useBills";
import MaintenanceBillCard from "../../../../components/features/maintenance/MaintenanceBillCard";
import PenaltyCard from "../../../../components/features/maintenance/PenaltyCard";
import PaymentModal from "../../../../components/features/maintenance/PaymentModal";

const UserMaintenancePaymentPage = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [activeTab, setActiveTab] = useState("current"); // current, history

  const { data: applicableData, isLoading: loadingApplicable } =
    useMyApplicableMaintenance();
  const { data: currentBillData, isLoading: loadingCurrentBill } =
    useCurrentBill();
  const { data: billsData, isLoading: loadingBills } = useMyBills();
  const { data: paymentHistoryData, isLoading: loadingHistory } =
    usePaymentHistory();
  const { mutate: processPayment, isPending: isProcessing } =
    useProcessPayment();

  const handlePayClick = (bill, paymentType = "maintenance") => {
    setSelectedBill(bill);
    setSelectedPaymentType(paymentType);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = (paymentData) => {
    processPayment(paymentData, {
      onSuccess: () => {
        setShowPaymentModal(false);
        setSelectedBill(null);
        setSelectedPaymentType(null);
      },
    });
  };

  if (loadingApplicable) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { hasUnit, unit, maintenance } = applicableData || {};
  const currentBill = currentBillData?.bill;
  const bills = billsData?.bills || [];
  const payments = paymentHistoryData?.payments || [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Receipt className="h-8 w-8 text-blue-600" />
          Maintenance & Payments
        </h1>
        <p className="text-gray-600 mt-2">
          View and pay your maintenance bills
        </p>
      </div>

      {/* No Unit Assigned */}
      {!hasUnit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">No Unit Assigned</p>
              <p className="text-sm text-yellow-800 mt-1">
                You don't have any unit assigned yet. Please contact your
                society admin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Unit & Maintenance Info */}
      {hasUnit && maintenance && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
            <h2 className="text-lg font-semibold">Your Unit Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Building</p>
                <p className="font-semibold text-gray-900">
                  {unit.building || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Unit</p>
                <p className="font-semibold text-gray-900">{unit.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Monthly Amount</p>
                <p className="font-semibold text-gray-900">
                  ₹{maintenance.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("current")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "current"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Receipt className="h-4 w-4" />
                Current Bills
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <History className="h-4 w-4" />
                Payment History
              </div>
            </button>
          </div>
        </div>

        {/* Current Bills Tab */}
        {activeTab === "current" && (
          <div className="p-6">
            {loadingCurrentBill ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : currentBill ? (
              <div className="space-y-6">
                {/* Penalty Card (if applicable) */}
                {currentBill.penaltyAmount > 0 &&
                  !currentBill.isPenaltyPaid && (
                    <PenaltyCard
                      bill={currentBill}
                      onPayClick={handlePayClick}
                    />
                  )}

                {/* Maintenance Bill Card */}
                <MaintenanceBillCard
                  bill={currentBill}
                  onPayClick={handlePayClick}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  No pending bills for current month
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your next bill will be generated on the billing date
                </p>
              </div>
            )}

            {/* All Bills List */}
            {bills.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Bills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bills.map((bill) => (
                    <MaintenanceBillCard
                      key={bill._id}
                      bill={bill}
                      onPayClick={handlePayClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === "history" && (
          <div className="p-6">
            {loadingHistory ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              payment.paymentType === "maintenance"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {payment.paymentType === "maintenance"
                              ? "Maintenance"
                              : "Penalty"}
                          </span>
                          <span className="text-sm text-gray-600">
                            {payment.bill?.billingMonth}/{payment.bill?.billingYear}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {payment.bill?.unit?.name} •{" "}
                          {payment.bill?.building?.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>TXN: {payment.transactionId}</span>
                          <span>
                            {new Date(
                              payment.transactionDate
                            ).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          ₹{payment.amount.toLocaleString()}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  No payment history available
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your payment records will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedBill(null);
          setSelectedPaymentType(null);
        }}
        bill={selectedBill}
        paymentType={selectedPaymentType}
        onConfirm={handlePaymentConfirm}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default UserMaintenancePaymentPage;
