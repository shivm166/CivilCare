import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateBuilding } from "../../hooks/useBuildings";

function CreateBuildingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    numberOfFloors: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const { mutate: createBuilding, isPending } = useCreateBuilding();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Building name is required";
    } else if (formData.name.length < 1 || formData.name.length > 100) {
      newErrors.name = "Building name must be between 1 and 100 characters";
    }

    if (!formData.numberOfFloors) {
      newErrors.numberOfFloors = "Number of floors is required";
    } else if (
      parseInt(formData.numberOfFloors) < 1 ||
      parseInt(formData.numberOfFloors) > 200
    ) {
      newErrors.numberOfFloors = "Number of floors must be between 1 and 200";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createBuilding(
      {
        name: formData.name.trim(),
        numberOfFloors: parseInt(formData.numberOfFloors),
        description: formData.description.trim(),
      },
      {
        onSuccess: () => {
          setFormData({ name: "", numberOfFloors: "", description: "" });
          setErrors({});
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Building
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Building Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Building Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Tower A, Block 1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Number of Floors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Floors <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numberOfFloors"
              value={formData.numberOfFloors}
              onChange={handleChange}
              placeholder="e.g., 10"
              min="1"
              max="200"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.numberOfFloors ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.numberOfFloors && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numberOfFloors}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional details..."
              rows="3"
              maxLength="500"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Create Building"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBuildingModal;