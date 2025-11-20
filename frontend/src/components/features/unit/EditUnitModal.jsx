import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateUnit } from "../../../hooks/api/useUnit";
import toast from "react-hot-toast";
import UnitTypeSelect from "./UnitTypeSelect";

function EditUnitModal({ isOpen, onClose, unit, buildingMaxFloors }) {
  const [formData, setFormData] = useState({
    name: "",
    floor: "",
    bhkType: "2bhk",
    type: "owner_occupied",
  });

  const { mutate: updateUnitMutation, isPending } = useUpdateUnit();

  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name || "",
        floor: unit.floor || "",
        bhkType: unit.bhkType || "2bhk",
        type: unit.type || "owner_occupied",
      });
    }
  }, [unit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Unit name is required");
      return;
    }

    if (parseInt(formData.floor) < 0 || parseInt(formData.floor) > buildingMaxFloors) {
      toast.error(`Floor must be between 0 and ${buildingMaxFloors}`);
      return;
    }

    updateUnitMutation(
      {
        unitId: unit._id,
        data: {
          name: formData.name.trim(),
          floor: parseInt(formData.floor),
          bhkType: formData.bhkType,
          type: formData.type,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Unit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 101, A-201"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, floor: e.target.value }))
                }
                min="0"
                max={buildingMaxFloors}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max floor: {buildingMaxFloors}
              </p>
            </div>

            <UnitTypeSelect
              value={formData.bhkType}
              onChange={(value) => setFormData(prev => ({ ...prev, bhkType: value }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="owner_occupied">Owner Occupied</option>
                <option value="tenant_occupied">Tenant Occupied</option>
                <option value="vacant">Vacant</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUnitModal;