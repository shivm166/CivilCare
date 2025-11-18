import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateUnit } from '../../../hooks/api/useUnit';

export default function CreateUnitModal({ isOpen, onClose, buildingId, maxFloors }) {
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    type: 'vacant',
  });

  const [errors, setErrors] = useState({});
  const {mutate: createUnit ,isPending} = useCreateUnit()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Unit name is required';
    }
    
    if (!formData.floor) {
        newErrors.floor = 'Floor number is required';
    } else if (isNaN(formData.floor) || Number(formData.floor) < 0) {
        newErrors.floor = 'Floor must be a positive number';
    } else if (maxFloors && Number(formData.floor) >  maxFloors) {
        newErrors.floor = `Floor cannot exceed building floors (${maxFloors})`;
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    createUnit(
        {buildingId, data: formData},
        {
            onSuccess: () => {
                handleClose()
            },
            onError: (error) => {
                setErrors({ 
                    submit: error.response?.data?.message || "Failed to create unit" 
                }); 
            },
        }
    )
    
    // Reset form
    setFormData({
        name: '',
        floor: '',
        type: 'vacant',
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
        name: '',
        floor: '',
        type: 'vacant',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Create New Unit</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Unit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter unit name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number *</label>
            <input
              type="number"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              min="0"
              max={maxFloors}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.floor ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. 1"
              disabled={isPending}
            />
            {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupancy Status</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              <option value="vacant">Vacant</option>
              <option value="owner_occupied">Owner Occupied</option>
              <option value="tenant_occupied">Tenant Occupied</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}