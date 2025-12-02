import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../common/Button/Button.jsx";
import { useGenerateBill } from "../../hooks/api/useMaintenance.js";
import { useUnitsBySociety } from "../../hooks/api/useUnit.js";
import toast from "react-hot-toast";

const getCurrentMonthString = () => {
  const date = new Date();
  // Format: YYYY-MM
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const GenerateBillFormModal = ({ isOpen, onClose, rules = [] }) => {
  const generateMutation = useGenerateBill();
  const { data: units, isLoading: isLoadingUnits } = useUnitsBySociety();

  const [formData, setFormData] = useState({
    unitId: "", // Selected unit ID
    ruleId: "", // Selected rule ID
    forMonth: getCurrentMonthString(), // Billing month (e.g., "2025-01")
  });
  const [filteredRules, setFilteredRules] = useState([]);

  // ✨ FIX 1: Initialization Flag to break the initial loop
  const [isInitialized, setIsInitialized] = useState(false);

  // ✨ DERIVATION: Find the BHK type based on the currently selected unitId
  const selectedUnitBhk =
    units?.find((u) => u._id === formData.unitId)?.bhkType || null;

  // ✨ useEffect 1 (FIXED): Set initial unit/BHK only once. (Prevents initial loop)
  useEffect(() => {
    // Only run if units are loaded, units exist, AND initialization is not complete AND unitId is empty
    if (
      !isLoadingUnits &&
      units &&
      units.length > 0 &&
      !isInitialized &&
      formData.unitId === ""
    ) {
      const defaultUnit = units[0];

      setFormData((prev) => ({
        ...prev,
        unitId: defaultUnit._id,
      }));

      // Prevent this useEffect from running again after the initial set
      setIsInitialized(true);
    }
  }, [units, isLoadingUnits, isInitialized, formData.unitId]);

  // ✨ useEffect 2 (FIXED): Filter rules and set default ruleId safely. (Prevents recursive loop)
  useEffect(() => {
    // Run if rules are available and a BHK type is selected
    if (selectedUnitBhk && rules) {
      const filtered = rules.filter(
        (r) => r.bhkType === selectedUnitBhk && r.active
      );
      setFilteredRules(filtered);

      // Use functional update for safety and logic checks
      setFormData((prev) => {
        let nextRuleId = prev.ruleId;

        if (filtered.length > 0) {
          const currentRuleValid = filtered.some((r) => r._id === prev.ruleId);

          // If current rule is invalid or missing, select the first valid rule
          if (!currentRuleValid || prev.ruleId === "") {
            nextRuleId = filtered[0]._id;
          }
        } else {
          // No rules found, clear the selection
          nextRuleId = "";
        }

        // Only update if the ruleId has actually changed (CRUCIAL for loop prevention)
        if (nextRuleId !== prev.ruleId) {
          return { ...prev, ruleId: nextRuleId };
        }
        return prev; // Return prev state if no change, breaking the loop
      });
    } else {
      setFilteredRules([]);
      setFormData((prev) => {
        // Clear ruleId only if it was set
        if (prev.ruleId !== "") {
          return { ...prev, ruleId: "" };
        }
        return prev;
      });
    }
  }, [selectedUnitBhk, rules]); // Dependencies are clean, relying on derived state

  const handleUnitChange = (e) => {
    const selectedUnitId = e.target.value;

    // Update unitId and explicitly clear ruleId to force the selection logic in useEffect 2
    setFormData((prev) => ({
      ...prev,
      unitId: selectedUnitId,
      ruleId: "",
    }));

    // Note: selectedUnitBhk is automatically derived when `units` array changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.unitId || !formData.ruleId) {
      toast.error("Please select a Unit and a valid Maintenance Rule.");
      return;
    }

    generateMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(`Bill generated successfully for ${formData.forMonth}!`);
        onClose();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to generate bill."
        );
      },
    });
  };

  if (!isOpen) return null;

  const isGenerating = generateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">⚡ Generate Maintenance Bill</h3>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Billing Month */}
          <div>
            <label
              htmlFor="forMonth"
              className="block text-sm font-medium text-gray-700"
            >
              Billing Month
            </label>
            <input
              id="forMonth"
              type="month"
              name="forMonth"
              value={formData.forMonth}
              onChange={(e) =>
                setFormData({ ...formData, forMonth: e.target.value })
              }
              required
              disabled={isGenerating}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Unit Selection */}
          <div>
            <label
              htmlFor="unitId"
              className="block text-sm font-medium text-gray-700"
            >
              Select Unit
            </label>
            <select
              id="unitId"
              name="unitId"
              value={formData.unitId}
              onChange={handleUnitChange}
              required
              disabled={isLoadingUnits || isGenerating}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                {isLoadingUnits
                  ? "Loading units..."
                  : units?.length === 0
                  ? "No units found"
                  : "Select a Unit"}
              </option>
              {units &&
                units.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.unitNumber} ({unit.bhkType}) - Resident:{" "}
                    {unit.resident?.name || "Unassigned"}
                  </option>
                ))}
            </select>
          </div>

          {/* Rule Selection (Filtered by Unit BHK) */}
          <div>
            <label
              htmlFor="ruleId"
              className="block text-sm font-medium text-gray-700"
            >
              Applicable Maintenance Rule
            </label>
            <select
              id="ruleId"
              name="ruleId"
              value={formData.ruleId}
              onChange={(e) =>
                setFormData({ ...formData, ruleId: e.target.value })
              }
              required
              disabled={filteredRules.length === 0 || isGenerating}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                {selectedUnitBhk
                  ? `Select rule for ${selectedUnitBhk}`
                  : "Select a Unit first"}
              </option>
              {filteredRules.map((rule) => (
                <option key={rule._id} value={rule._id}>
                  {rule.bhkType} - ₹{rule.amount.toFixed(2)} (Due Day:{" "}
                  {rule.dueDay})
                </option>
              ))}
            </select>
            {selectedUnitBhk && filteredRules.length === 0 && (
              <p className="text-red-500 text-xs mt-1">
                No active maintenance rule found for {selectedUnitBhk}.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Bill"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateBillFormModal;
