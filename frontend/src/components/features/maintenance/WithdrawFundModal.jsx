import React, { useState } from "react";
import { X, AlertCircle, DollarSign } from "lucide-react";

const WithdrawFundModal = ({ isOpen, onClose, availableBalance, onConfirm, isProcessing }) => {
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = `Amount cannot exceed available balance (₹${availableBalance.toLocaleString()})`;
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onConfirm({
        amount: parseFloat(formData.amount),
        reason: formData.reason.trim(),
        notes: formData.notes.trim(),
      });
    }
  };

  const handleClose = () => {
    setFormData({ amount: "", reason: "", notes: "" });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Withdraw Funds</h2>
              <p className="text-sm text-red-100 mt-1">
                Withdraw money from society fund
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Available Balance */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">
                Available Balance
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{availableBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Important!</p>
              <p className="mt-1">
                Withdrawals are permanent and will be recorded in society fund
                transactions. Please ensure the reason is clear and accurate.
              </p>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Withdrawal Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isProcessing}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Withdrawal Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g., Maintenance work for building A, Security staff salary payment, etc."
              rows="3"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${
                errors.reason ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isProcessing}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.reason ? (
                <p className="text-sm text-red-600">{errors.reason}</p>
              ) : (
                <p className="text-xs text-gray-500">Minimum 10 characters</p>
              )}
              <p className="text-xs text-gray-500">
                {formData.reason.length}/500
              </p>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional details..."
              rows="2"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.notes.length}/500
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>Confirm Withdrawal</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawFundModal;
