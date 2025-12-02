// /frontend/src/pages/dashboard/User/Maintenance/components/PaymentModal.jsx

import React, { useState } from "react";
import { usePayMaintenance } from "../../../../../hooks/api/useMaintenance"; // assumed path
import Input from "../../../../../components/common/Input/Input.jsx"; // assumed path
import Button from "../../../../../components/common/Button/Button.jsx"; // assumed path

const PaymentModal = ({ bill, onClose }) => {
  const payMutation = usePayMaintenance();
  const [formData, setFormData] = useState({
    billId: bill._id,
    amount: bill.totalAmount, // Pre-filled with total amount due
    method: "upi",
    transactionId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure the amount is at least the total due
    if (parseFloat(formData.amount) < bill.totalAmount) {
      alert(
        `Payment must be at least the total amount due: ₹${bill.totalAmount.toFixed(
          2
        )}`
      );
      return;
    }

    payMutation.mutate(formData, {
      onSuccess: () => {
        alert("Payment successful!");
        onClose(); // Close modal on success
      },
      onError: (error) => {
        alert(
          `Payment failed: ${error.response?.data?.message || "Server Error"}`
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          💰 Confirm Payment for {bill.forMonth}
        </h3>
        <p className="text-lg mb-4">
          Total Amount Due:{" "}
          <span className="text-green-600 font-bold">
            ₹{bill.totalAmount.toFixed(2)}
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="upi">UPI</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Amount Input */}
          <Input
            label="Amount Paid"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            className="mb-4"
          />

          {/* Transaction ID/Reference */}
          <Input
            label="Transaction ID / Reference"
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            placeholder="Enter UPI/Cheque/Cash Ref"
            className="mb-6"
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={payMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={payMutation.isPending}
            >
              {payMutation.isPending ? "Processing..." : "Submit Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
