import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useMyBills, useProcessPayment } from "../../../../hooks/api/useBills";
import MaintenanceBillCard from "../../../../components/features/maintenance/MaintenanceBillCard";
import PenaltyCard from "../../../../components/features/maintenance/PenaltyCard";
import PaymentModal from "../../../../components/features/maintenance/PaymentModal";

const UserMaintenancePage = () => {
  const { currentSociety } = useSocietyContext();
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fetch user bills
  const { data: billsData, isLoading, error, refetch } = useMyBills({});
  const { mutate: processPayment, isLoading: isProcessing } = useProcessPayment();

  const bills = billsData?.bills || [];

  // Separate bills by status
  const pendingBills = bills.filter((bill) => bill.status !== "paid");
  const paidBills = bills.filter((bill) => bill.status === "paid");

  // Separate overdue bills with penalty
  const overdueBillsWithPenalty = pendingBills.filter(
    (bill) => 
      (bill.status === "overdue" || bill.status === "partially_paid") && 
      bill.penaltyAmount > 0
  );

  const regularPendingBills = pendingBills.filter(
    (bill) => 
      !(bill.status === "overdue" || bill.status === "partially_paid") || 
      bill.penaltyAmount === 0
  );

  // Handle payment initiation
  const handlePayNow = (bill, type) => {
    console.log("💳 Payment initiated:", { bill: bill._id, type });
    setSelectedBill(bill);
    setPaymentType(type);
    setIsPaymentModalOpen(true);
  };

  // Handle payment confirmation
  const handlePaymentConfirm = (paymentData) => {
    console.log("✅ Processing payment:", paymentData);
    
    processPayment(paymentData, {
      onSuccess: () => {
        setIsPaymentModalOpen(false);
        setSelectedBill(null);
        setPaymentType(null);
        refetch();
      },
      onError: (error) => {
        console.error("❌ Payment error:", error);
      },
    });
  };

  if (!currentSociety) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">
            Please select a society to view maintenance bills
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">Error loading bills: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Maintenance Payments
        </h1>
        <p className="text-gray-600 mt-2">
          View and pay your maintenance bills
        </p>
      </div>

      {/* Overdue Bills with Penalty - Priority Section */}
      {overdueBillsWithPenalty.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-700">
                Urgent: Penalty Payments Required
              </h2>
              <p className="text-red-600 text-sm">
                Pay penalties first to unlock maintenance payments
              </p>
            </div>
            <span className="ml-auto bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
              {overdueBillsWithPenalty.length} Overdue
            </span>
          </div>

          {/* Alert Banner */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  Important Payment Rule
                </h3>
                <p className="text-red-800 text-sm leading-relaxed">
                  For overdue bills, you must first pay the{" "}
                  <span className="font-bold">penalty amount</span> before you
                  can pay the maintenance amount. This is to ensure timely
                  payments in the future.
                </p>
              </div>
            </div>
          </div>

          {/* Overdue Bill Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overdueBillsWithPenalty.map((bill) => (
              <div key={bill._id} className="space-y-4">
                {/* Penalty Card - Shows ONLY if penalty not paid */}
                {!bill.isPenaltyPaid && bill.penaltyAmount > 0 && (
                  <PenaltyCard
                    bill={bill}
                    onPayClick={() => handlePayNow(bill, "penalty")}
                  />
                )}

                {/* Maintenance Card - Shows ALWAYS but disabled if penalty unpaid */}
                <MaintenanceBillCard
                  bill={bill}
                  onPayClick={() => handlePayNow(bill, "maintenance")}
                  disabled={!bill.isPenaltyPaid && bill.penaltyAmount > 0}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Pending Bills */}
      {regularPendingBills.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Pending Bills</h2>
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
              {regularPendingBills.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPendingBills.map((bill) => (
              <MaintenanceBillCard
                key={bill._id}
                bill={bill}
                onPayClick={() => handlePayNow(bill, "maintenance")}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Pending Bills */}
      {pendingBills.length === 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-10 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            All Caught Up!
          </h3>
          <p className="text-green-700 text-lg">
            You have no pending maintenance bills.
          </p>
          <p className="text-green-600 text-sm mt-2">
            Check back next month for your new bill.
          </p>
        </div>
      )}

      {/* Payment History */}
      {paidBills.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Payment History
            </h2>
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
              {paidBills.length} Paid
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paidBills.slice(0, 6).map((bill) => (
              <MaintenanceBillCard key={bill._id} bill={bill} isPaid={true} />
            ))}
          </div>

          {paidBills.length > 6 && (
            <div className="text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All Payment History →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedBill(null);
          setPaymentType(null);
        }}
        bill={selectedBill}
        paymentType={paymentType}
        onConfirm={handlePaymentConfirm}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default UserMaintenancePage;
