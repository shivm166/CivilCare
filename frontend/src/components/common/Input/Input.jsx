// frontend/src/components/common/Input/Input.jsx
import React from "react";
import { AlertCircle } from "lucide-react";

const Input = ({
  label,
  error,
  required = false,
  className = "",
  ...props
}) => {
  const inputBaseStyle =
    "w-full px-4 py-2.5 text-sm border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none disabled:bg-gray-100";
  const inputErrorStyle = error ? "border-red-500" : "border-gray-200";

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className={`${inputBaseStyle} ${inputErrorStyle} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
