import React, { useState } from "react";
import { X, FileText, Building, DollarSign, Calendar } from "lucide-react";
import { useCreateMaintenanceRule } from "../../../hooks/api/useMaintenance";
import { useBuildings } from "../../../hooks/api/useBuildings";
import { UNIT_BHK_TYPES } from "../../../config/unit.config";
import toast from "react-hot-toast";

const CreateRuleModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    ruleName: "",
    ruleType: "general",
    building: "",
    amountType: "flat",
    amount: "",
    bhkWiseAmounts: {
      "1bhk": "",
      "2bhk": "",
      "3bhk": "",
      penthouse: "",
    },
    billingDay: "1",
    dueDays: "5",
    penaltyEnabled: false,
    penaltyType: "percentage",
    penaltyValue: "",
    description: "",
    isActive: true,
  });

  const { mutate: createRule, isPending } = useCreateMaintenanceRule();
  const { data: buildingsData, isLoading: loadingBuildings } = useBuildings();

  const buildings = Array.isArray(buildingsData)
    ? buildingsData
    : buildingsData?.buildingWithUnitCount || buildingsData?.building || buildingsData?.buildings || [];

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

    // Validation for building-specific rules
    if (formData.ruleType === "building_specific" && !formData.building) {
      toast.error("Please select a building");
      return;
    }

    // Validation for amount
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

    // Build payload
    const payload = {
      ruleName: formData.ruleName.trim(),
      ruleType: formData.ruleType,
      amountType: formData.amountType,
      billingDay: parseInt(formData.billingDay),
      dueDays: parseInt(formData.dueDays),
      penaltyEnabled: formData.penaltyEnabled,
      description: formData.description.trim(),
      isActive: formData.isActive,
    };

    // Add building only for building-specific rules
    if (formData.ruleType === "building_specific") {
      payload.building = formData.building;
    } else {
      payload.building = null;
    }

    // Add amount based on type
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

    // Add penalty if enabled
    if (formData.penaltyEnabled) {
      payload.penaltyType = formData.penaltyType;
      payload.penaltyValue = parseFloat(formData.penaltyValue) || 0;
    } else {
      payload.penaltyType = "percentage";
      payload.penaltyValue = 0;
    }

    console.log("Submitting payload:", payload); // Debug log

    createRule(payload, {
      onSuccess: () => {
        // Reset form
        setFormData({
          ruleName: "",
          ruleType: "general",
          building: "",
          amountType: "flat",
          amount: "",
          bhkWiseAmounts: {
            "1bhk": "",
            "2bhk": "",
            "3bhk": "",
            penthouse: "",
          },
          billingDay: "1",
          dueDays: "5",
          penaltyEnabled: false,
          penaltyType: "percentage",
          penaltyValue: "",
          description: "",
          isActive: true,
        });
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
              <FileText className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold">Create Maintenance Rule</h2>
              <p className="text-xs sm:text-sm text-emerald-100">Define maintenance charges for your society</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close modal">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Rule Name */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Rule Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ruleName"
              value={formData.ruleName}
              onChange={handleChange}
              placeholder="e.g., General Maintenance, Tower A Special"
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Rule Type - UPDATED: Only General and Building Specific */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Rule Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {/* General Rule */}
              <label
                className={`flex items-center gap-2 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.ruleType === "general"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-300 hover:border-emerald-300"
                }`}
              >
                <input
                  type="radio"
                  name="ruleType"
                  value="general"
                  checked={formData.ruleType === "general"}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({ ...prev, building: "" }));
                  }}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-lg">🏢</span>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-medium block">General (All Units)</span>
                  <span className="text-xs text-gray-500">Applies to all units in society</span>
                </div>
              </label>

              {/* Building Specific Rule */}
              <label
                className={`flex items-center gap-2 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.ruleType === "building_specific"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-300 hover:border-emerald-300"
                }`}
              >
                <input
                  type="radio"
                  name="ruleType"
                  value="building_specific"
                  checked={formData.ruleType === "building_specific"}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({ ...prev, building: "" }));
                  }}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-lg">🏗️</span>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-medium block">Building Specific</span>
                  <span className="text-xs text-gray-500">Applies to specific building only</span>
                </div>
              </label>
            </div>
          </div>

          {/* Building Selection (for building_specific only) */}
          {formData.ruleType === "building_specific" && (
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Select Building <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                <select
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  required
                  disabled={loadingBuildings}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100"
                >
                  <option value="">{loadingBuildings ? "Loading buildings..." : "Select building"}</option>
                  {buildings.map((building) => (
                    <option key={building._id} value={building._id}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Amount Type */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Amount Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { value: "flat", label: "Flat Amount" },
                { value: "bhk_wise", label: "BHK Wise Amount" },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center justify-center gap-2 p-2.5 sm:p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.amountType === type.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300 hover:border-emerald-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="amountType"
                    value={type.value}
                    checked={formData.amountType === type.value}
                    onChange={handleChange}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs sm:text-sm font-medium">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Flat Amount */}
          {formData.amountType === "flat" && (
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Maintenance Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="5000"
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

{/* BHK Wise Amounts */}
{formData.amountType === "bhk_wise" && (
  <div>
    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
      BHK Wise Amounts (₹) <span className="text-red-500">*</span>
    </label>
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* 1 BHK */}
      <div>
        <label className="block text-xs text-gray-600 mb-1.5 font-medium">1 BHK</label>
        <input
          type="number"
          value={formData.bhkWiseAmounts["1bhk"]}
          onChange={(e) => handleBhkAmountChange("1bhk", e.target.value)}
          placeholder="Enter amount for 1 BHK"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* 2 BHK */}
      <div>
        <label className="block text-xs text-gray-600 mb-1.5 font-medium">2 BHK</label>
        <input
          type="number"
          value={formData.bhkWiseAmounts["2bhk"]}
          onChange={(e) => handleBhkAmountChange("2bhk", e.target.value)}
          placeholder="Enter amount for 2 BHK"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* 3 BHK */}
      <div>
        <label className="block text-xs text-gray-600 mb-1.5 font-medium">3 BHK</label>
        <input
          type="number"
          value={formData.bhkWiseAmounts["3bhk"]}
          onChange={(e) => handleBhkAmountChange("3bhk", e.target.value)}
          placeholder="Enter amount for 3 BHK"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Penthouse */}
      <div>
        <label className="block text-xs text-gray-600 mb-1.5 font-medium">Penthouse</label>
        <input
          type="number"
          value={formData.bhkWiseAmounts.penthouse}
          onChange={(e) => handleBhkAmountChange("penthouse", e.target.value)}
          placeholder="Enter amount for Penthouse"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-2">💡 Enter the maintenance amount for each unit type</p>
  </div>
)}


          {/* Billing Configuration */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Billing Day <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  name="billingDay"
                  value={formData.billingDay}
                  onChange={handleChange}
                  min="1"
                  max="28"
                  required
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Day of month (1-28)</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Due Days <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="dueDays"
                value={formData.dueDays}
                onChange={handleChange}
                min="0"
                max="30"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Days after billing</p>
            </div>
          </div>

          {/* Penalty Configuration */}
          <div className="border-2 border-gray-200 rounded-lg p-3 sm:p-4">
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                name="penaltyEnabled"
                checked={formData.penaltyEnabled}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
              />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Enable Late Payment Penalty</span>
            </label>

            {formData.penaltyEnabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Penalty Type</label>
                  <select
                    name="penaltyType"
                    value={formData.penaltyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="daily">Daily Charge (₹/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Penalty Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="penaltyValue"
                    value={formData.penaltyValue}
                    onChange={handleChange}
                    placeholder={formData.penaltyType === "percentage" ? "10" : "500"}
                    required={formData.penaltyEnabled}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes about this rule..."
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Active Status */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Activate this rule immediately</span>
          </label>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 shadow-lg z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {isPending ? "Creating..." : "Create Rule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRuleModal;
