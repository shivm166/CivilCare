import React, { useState, useEffect } from "react";
import { X, FileText, Building, DollarSign, Calendar, AlertCircle, Lock } from "lucide-react";
import { useUpdateMaintenanceRule } from "../../../hooks/api/useMaintenance";
import toast from "react-hot-toast";

const EditRuleModal = ({ isOpen, onClose, rule }) => {
  const [formData, setFormData] = useState({
    ruleName: "",
    amountType: "flat",
    amount: "",
    bhkWiseAmounts: {
      "1bhk": "",
      "2bhk": "",
      "3bhk": "",
      "penthouse": "",
    },
    billingDay: "1",
    dueDays: "5",
    penaltyEnabled: false,
    penaltyType: "percentage",
    penaltyValue: "",
    description: "",
    isActive: true,
  });

  const { mutate: updateRule, isPending } = useUpdateMaintenanceRule();

  useEffect(() => {
    if (rule) {
      setFormData({
        ruleName: rule.ruleName || "",
        amountType: rule.amountType || "flat",
        amount: rule.amount?.toString() || "",
        bhkWiseAmounts: {
          "1bhk": rule.bhkWiseAmounts?.["1bhk"]?.toString() || "",
          "2bhk": rule.bhkWiseAmounts?.["2bhk"]?.toString() || "",
          "3bhk": rule.bhkWiseAmounts?.["3bhk"]?.toString() || "",
          penthouse: rule.bhkWiseAmounts?.penthouse?.toString() || "",
        },
        billingDay: rule.billingDay?.toString() || "1",
        dueDays: rule.dueDays?.toString() || "5",
        penaltyEnabled: rule.penaltyEnabled || false,
        penaltyType: rule.penaltyType || "percentage",
        penaltyValue: rule.penaltyValue?.toString() || "",
        description: rule.description || "",
        isActive: rule.isActive !== undefined ? rule.isActive : true,
      });
    }
  }, [rule]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBhkAmountChange = (bhkType, value) => {
    setFormData((prev) => ({
      ...prev,
      bhkWiseAmounts: {
        ...prev.bhkWiseAmounts,
        [bhkType]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.ruleName.trim()) {
      toast.error("Please enter a rule name");
      return;
    }

    if (formData.amountType === "flat" && !formData.amount) {
      toast.error("Please enter maintenance amount");
      return;
    }

    if (formData.amountType === "bhk_wise") {
      const hasAmount = Object.values(formData.bhkWiseAmounts).some(
        (amt) => amt && parseFloat(amt) > 0
      );
      if (!hasAmount) {
        toast.error("Please enter at least one BHK amount");
        return;
      }
    }

    const payload = {
      ruleName: formData.ruleName.trim(),
      amountType: formData.amountType,
      billingDay: parseInt(formData.billingDay),
      dueDays: parseInt(formData.dueDays),
      penaltyEnabled: formData.penaltyEnabled,
      description: formData.description.trim(),
      isActive: formData.isActive,
    };

    if (formData.amountType === "flat") {
      payload.amount = parseFloat(formData.amount) || 0;
      payload.bhkWiseAmounts = {};
    } else {
      payload.amount = 0;
      payload.bhkWiseAmounts = {
        "1bhk": parseFloat(formData.bhkWiseAmounts["1bhk"]) || 0,
        "2bhk": parseFloat(formData.bhkWiseAmounts["2bhk"]) || 0,
        "3bhk": parseFloat(formData.bhkWiseAmounts["3bhk"]) || 0,
        penthouse: parseFloat(formData.bhkWiseAmounts.penthouse) || 0,
      };
    }

    if (formData.penaltyEnabled) {
      payload.penaltyType = formData.penaltyType;
      payload.penaltyValue = parseFloat(formData.penaltyValue) || 0;
    } else {
      payload.penaltyType = "percentage";
      payload.penaltyValue = 0;
    }

    updateRule(
      { ruleId: rule._id, ruleData: payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen || !rule) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 sm:p-4 rounded-t-xl sm:rounded-t-2xl flex justify-between items-center z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Edit Maintenance Rule</h2>
            <p className="text-orange-50 text-xs sm:text-sm mt-0.5">
              Update amounts and configurations
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-colors flex-shrink-0"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-5 space-y-4 sm:space-y-5">
          {/* READ-ONLY: Rule Type & Building Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Lock size={14} className="text-gray-500 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Rule Configuration (Cannot be edited)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Rule Type</label>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-1">
                  {rule.ruleType === "general" && "🏢 General (All Units)"}
                  {rule.ruleType === "building_specific" && "🏗️ Building Specific"}
                </p>
              </div>
              
              {rule.ruleType === "building_specific" && rule.building && (
                <div>
                  <label className="text-xs font-medium text-gray-600">Building</label>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-1">
                    {rule.building.name || rule.building}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rule Name */}
          <div>
            <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              <FileText size={14} className="mr-1.5 text-orange-500 sm:w-4 sm:h-4" />
              Rule Name *
            </label>
            <input
              type="text"
              name="ruleName"
              value={formData.ruleName}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., Monthly Maintenance 2024"
              required
            />
          </div>

          {/* Amount Configuration */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-orange-200">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <DollarSign size={14} className="mr-1.5 text-orange-500 sm:w-4 sm:h-4" />
              Amount Configuration
            </h3>

            {/* Amount Type */}
            <div className="mb-3 sm:mb-4">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 block">
                Amount Type *
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, amountType: "flat" }))
                  }
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border-2 font-medium transition-all ${
                    formData.amountType === "flat"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent"
                      : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                  }`}
                >
                  Flat Amount
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, amountType: "bhk_wise" }))
                  }
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border-2 font-medium transition-all ${
                    formData.amountType === "bhk_wise"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent"
                      : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                  }`}
                >
                  BHK-wise Amount
                </button>
              </div>
            </div>

            {/* Flat Amount */}
            {formData.amountType === "flat" && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 block">
                  Maintenance Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 5000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            )}

            {/* BHK-wise Amounts */}
            {formData.amountType === "bhk_wise" && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
                  BHK Wise Amounts (₹) *
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">1 BHK</label>
                    <input
                      type="number"
                      value={formData.bhkWiseAmounts["1bhk"]}
                      onChange={(e) => handleBhkAmountChange("1bhk", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">2 BHK</label>
                    <input
                      type="number"
                      value={formData.bhkWiseAmounts["2bhk"]}
                      onChange={(e) => handleBhkAmountChange("2bhk", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">3 BHK</label>
                    <input
                      type="number"
                      value={formData.bhkWiseAmounts["3bhk"]}
                      onChange={(e) => handleBhkAmountChange("3bhk", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Penthouse</label>
                    <input
                      type="number"
                      value={formData.bhkWiseAmounts.penthouse}
                      onChange={(e) => handleBhkAmountChange("penthouse", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">💡 Enter the maintenance amount for each unit type</p>
              </div>
            )}
          </div>

          {/* Billing Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <Calendar size={14} className="mr-1.5 text-orange-500 sm:w-4 sm:h-4" />
                Billing Day *
              </label>
              <select
                name="billingDay"
                value={formData.billingDay}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                    {day === 1
                      ? "st"
                      : day === 2
                      ? "nd"
                      : day === 3
                      ? "rd"
                      : "th"}{" "}
                    of month
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <Calendar size={14} className="mr-1.5 text-orange-500 sm:w-4 sm:h-4" />
                Due Days *
              </label>
              <input
                type="number"
                name="dueDays"
                value={formData.dueDays}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 5"
                min="1"
                max="30"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Days before penalty
              </p>
            </div>
          </div>

          {/* Penalty Configuration */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 sm:p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center">
                <AlertCircle size={14} className="mr-1.5 text-red-500 sm:w-4 sm:h-4" />
                Late Payment Penalty
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="penaltyEnabled"
                  checked={formData.penaltyEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {formData.penaltyEnabled && (
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 block">
                    Penalty Type *
                  </label>
                  <select
                    name="penaltyType"
                    value={formData.penaltyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="percentage">Percentage of Amount</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="daily">Daily Charge</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 block">
                    Penalty Value *
                  </label>
                  <input
                    type="number"
                    name="penaltyValue"
                    value={formData.penaltyValue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={
                      formData.penaltyType === "percentage"
                        ? "e.g., 10 (for 10%)"
                        : "e.g., 500"
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.penaltyType === "percentage" &&
                      "Percentage of maintenance amount"}
                    {formData.penaltyType === "fixed" && "One-time fixed penalty amount"}
                    {formData.penaltyType === "daily" &&
                      "Amount charged per day after due date"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 block">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Additional notes about this rule..."
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-700">Rule Status</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Inactive rules won't generate new bills
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRuleModal;