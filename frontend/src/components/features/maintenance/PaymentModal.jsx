import React, { useState } from "react";
import { X, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";

const PaymentModal = ({ isOpen, onClose, bill, paymentType, onConfirm, isProcessing }) => {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardLast4: "",
    bankName: "",
  });

  if (!isOpen || !bill) return null;

  const amount = paymentType === "penalty" ? bill.penaltyAmount : bill.baseAmount;

  const paymentMethods = [
    { id: "upi", label: "UPI", icon: Smartphone, color: "text-purple-600" },
    { id: "card", label: "Card", icon: CreditCard, color: "text-blue-600" },
    { id: "netbanking", label: "Net Banking", icon: Building2, color: "text-green-600" },
    { id: "cash", label: "Cash", icon: Wallet, color: "text-orange-600" },
  ];

  const handlePayment = () => {
    const metadata = {};
    
    if (selectedMethod === "upi" && paymentDetails.upiId) {
      metadata.upiId = paymentDetails.upiId;
    } else if (selectedMethod === "card" && paymentDetails.cardLast4) {
      metadata.cardLast4 = paymentDetails.cardLast4;
    } else if (selectedMethod === "netbanking" && paymentDetails.bankName) {
      metadata.bankName = paymentDetails.bankName;
    }

    onConfirm({
      billId: bill._id,
      paymentType,
      amount,
      paymentMethod: selectedMethod,
      paymentMetadata: metadata,
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Payment Details</h2>
              <p className="text-sm text-blue-100 mt-1">
                {paymentType === "penalty" ? "Penalty" : "Maintenance"} - {monthNames[bill.billingMonth - 1]} {bill.billingYear}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Amount Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Amount to Pay</span>
              <span className="text-3xl font-bold text-blue-600">
                ₹{amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${method.color}`} />
                    <p className="text-sm font-medium text-gray-700">
                      {method.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Details Input */}
          <div>
            {selectedMethod === "upi" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={paymentDetails.upiId}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, upiId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {selectedMethod === "card" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last 4 digits of Card (Optional)
                </label>
                <input
                  type="text"
                  placeholder="1234"
                  maxLength="4"
                  value={paymentDetails.cardLast4}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cardLast4: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {selectedMethod === "netbanking" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., HDFC Bank"
                  value={paymentDetails.bankName}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, bankName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {selectedMethod === "cash" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  💵 Cash payments will be recorded as paid. Please collect
                  payment receipt from admin.
                </p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600">
              ℹ️ This is a <span className="font-semibold">dummy payment system</span> for demonstration purposes. 
              No actual transaction will be processed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{amount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
