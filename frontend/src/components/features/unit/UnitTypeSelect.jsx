import React from 'react'
import { UNIT_BHK_TYPES } from '../../../config/unit.config'

function UnitTypeSelect({value, onChange, error, required = true, disabled = false}) {
  return (
    <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Unit Type (BHK) {required && <span className="text-red-500">*</span>}
        </label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        >
            <option value="">Select Unit Type</option>
            {
                UNIT_BHK_TYPES.map((type) => (
                    <option key={type}>
                        {type}
                    </option>
                ))
            }
        </select>
        {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
    </div>
  )
}

export default UnitTypeSelect