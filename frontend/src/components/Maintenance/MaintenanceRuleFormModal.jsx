import React, { useState } from "react";
import { X } from "lucide-react";
import Input from "../common/Input/Input.jsx";
import Button from "../common/Button/Button.jsx";
import { useCreateRule } from "../../hooks/api/useMaintenance.js";

const BHK_TYPES = ["1BHK", "2BHK", "3BHK", "4BHK"];
const PENALTY_TYPES = [
  "fixed_amount",
  "percentage_of_maintenance",
  "daily_rate",
];

const MaintenanceRuleFormModal = ({ isOpen, onClose, initialData = null }) => {
  const isEditing = !!initialData;
  const createMutation = useCreateRule();

  const [formData, setFormData] = useState(
    initialData || {
      bhkType: BHK_TYPES[0],
      amount: 500,
      dueDay: 10,
      gracePeriod: 5,
      penaltyType: PENALTY_TYPES[0],
      penaltyValue: 50,
      active: true,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Use an update mutation hook here when implemented
      alert(`Updating Rule: ${formData.bhkType}`);
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          alert(`Rule for ${formData.bhkType} created successfully!`);
          onClose();
        },
        onError: (error) => {
          alert(
            `Error creating rule: ${
              error.response?.data?.message || "Server Error"
            }`
          );
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {isEditing
              ? "Edit Maintenance Rule"
              : "Create New Maintenance Rule"}
          </h3>
          <button
            onClick={onClose}
            disabled={createMutation.isPending}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* BHK Type Select */}
          <div>
            <label
              htmlFor="bhkType"
              className="block text-sm font-medium text-gray-700"
            >
              Unit BHK Type
            </label>
            <select
              id="bhkType"
              name="bhkType"
              value={formData.bhkType}
              onChange={handleChange}
              disabled={isEditing || createMutation.isPending}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
            >
              {BHK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Amount and Due Day */}
          <div className="flex space-x-4">
            <Input
              label="Base Amount (₹)"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
            />
            <Input
              label="Due Day of Month"
              type="number"
              name="dueDay"
              value={formData.dueDay}
              onChange={handleChange}
              required
              min="1"
              max="31"
            />
          </div>

          {/* Grace Period */}
          <Input
            label="Grace Period (Days)"
            type="number"
            name="gracePeriod"
            value={formData.gracePeriod}
            onChange={handleChange}
            required
            min="0"
          />

          {/* Penalty Type and Value */}
          <div className="flex space-x-4">
            <div>
              <label
                htmlFor="penaltyType"
                className="block text-sm font-medium text-gray-700"
              >
                Penalty Type
              </label>
              <select
                id="penaltyType"
                name="penaltyType"
                value={formData.penaltyType}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
              >
                {PENALTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Penalty Value"
              type="number"
              name="penaltyValue"
              value={formData.penaltyValue}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
            >
              {isEditing ? "Save Changes" : "Create Rule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceRuleFormModal;
