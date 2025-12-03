import React, { useState } from "react";
import { X, IndianRupee, CreditCard, Receipt } from "lucide-react";
import Button from "../../../../../components/common/Button/Button";
import { usePayMaintenanceBill } from "../../../../../hooks/api/usemaintenance";

const PaymentModal = ({ bill, onClose }) => {
  const [formData, setFormData] = useState({
    method: "online", // Default method
    transactionId: "",
  });

  const { mutate: payBill, isPending: isPaying } = usePayMaintenanceBill();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Use the totalAmount which already includes the calculated late fee (bill.totalAmount is updated by updateBillLateFeeAndStatus on fetch)
  const finalAmount = bill.totalAmount || bill.amount || 0;
  const originalAmount = bill.amount || 0;
  const lateFee = bill.lateFeeApplied || 0;

  const formattedDueDate = bill.dueDate
    ? new Date(bill.dueDate).toDateString()
    : "N/A";

  const handleSubmit = (e) => {
    e.preventDefault();

    payBill(
      {
        billId: bill._id,
        amount: finalAmount,
        method: formData.method,
        transactionId: formData.transactionId,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            <CreditCard size={20} /> Pay Maintenance Bill
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Bill Summary */}
          <div className="border border-indigo-200 bg-indigo-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-indigo-700">
                Unit:
              </span>
              <span className="text-sm font-bold text-indigo-900">
                {bill.unit?.unitNumber} ({bill.unit?.bhkType})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-indigo-700">
                For Month:
              </span>
              <span className="text-sm font-bold text-indigo-900">
                {bill.forMonth}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-indigo-700">
                Due Date:
              </span>
              <span className="text-sm font-bold text-red-600">
                {formattedDueDate}
              </span>
            </div>
          </div>

          {/* Amount Details */}
          <div className="space-y-2">
            <h3 className="text-md font-bold text-gray-800 border-b pb-1">
              Amount Breakdown
            </h3>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Maintenance Amount:</span>
              <span className="text-sm font-medium">
                ₹{Number(originalAmount).toLocaleString()}
              </span>
            </div>
            <div
              className={`flex justify-between ${
                lateFee > 0 ? "text-red-600 font-medium" : "text-gray-600"
              }`}
            >
              <span className="text-sm">Late Fee Applied:</span>
              <span className="text-sm">
                ₹{Number(lateFee).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-lg font-bold text-indigo-700 flex items-center">
                <IndianRupee size={16} className="mr-1" /> Total Amount Due:
              </span>
              <span className="text-xl font-extrabold text-indigo-800">
                ₹{Number(finalAmount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-md font-bold text-gray-800 flex items-center gap-1">
              <Receipt size={16} /> Payment Details
            </h3>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Payment Method
              </label>
              <select
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              >
                <option value="online">Online Payment / UPI</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Transaction ID / Reference (Mandatory)
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder="Enter Transaction ID or Reference Number"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
              <p>
                Note: By clicking "Record Payment", you confirm a payment of **₹
                {Number(finalAmount).toLocaleString()}** has been successfully
                made.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isPaying}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
            >
              Record Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
