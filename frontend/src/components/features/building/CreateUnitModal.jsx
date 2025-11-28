import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateUnit } from "../../../hooks/api/useUnit";
import toast from "react-hot-toast";
import UnitTypeSelect from "../unit/UnitTypeSelect";

function CreateUnitModal({ isOpen, onClose, buildingId, buildingMaxFloors }) {
  const [formData, setFormData] = useState({
    name: "",
    floor: "",
    bhkType: "2bhk",
    type: "vacant",
  });

  const [errors, setErrors] = useState({});
  const { mutate: createUnitMutation, isPending } = useCreateUnit();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Unit name is required";
    }

    if (!formData.floor) {
      newErrors.floor = "Floor is required";
    } else if (
      parseInt(formData.floor) < 0 ||
      parseInt(formData.floor) > buildingMaxFloors
    ) {
      newErrors.floor = `Floor must be between 0 and ${buildingMaxFloors}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createUnitMutation(
      {
        buildingId,
        data: {
          name: formData.name.trim(),
          floor: parseInt(formData.floor),
          bhkType: formData.bhkType,
          type: formData.type,
        },
      },
      {
        onSuccess: () => {
          setFormData({ name: "", floor: "", bhkType: "2bhk", type: "vacant" });
          setErrors({});
          onClose();
        },
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/75 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Unit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Unit Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., 101, A-201, Flat 5"
                className={`w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Floor <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max={buildingMaxFloors}
                className={`w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.floor ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.floor ? (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.floor}</p>
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Max floor: {buildingMaxFloors}
                </p>
              )}
            </div>

            <UnitTypeSelect
              value={formData.bhkType}
              onChange={(value) => setFormData(prev => ({ ...prev, bhkType: value }))}
              error={errors.bhkType}
            />

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="owner_occupied">Owner Occupied</option>
                <option value="tenant_occupied">Tenant Occupied</option>
                <option value="vacant">Vacant</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Unit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUnitModal;