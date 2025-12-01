import React, { useState } from "react";
import {
  DollarSign,
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  IndianRupee,
} from "lucide-react";

const UNIT_BHK_TYPES = [
  "1BHK",
  "2BHK",
  "3BHK",
  "4BHK",
  "5BHK",
  "Studio",
  "Penthouse",
];
const PENALTY_TYPES = [
  { value: "fixed_amount", label: "Fixed Amount" },
  { value: "percentage_of_maintenance", label: "Percentage of Maintenance" },
  { value: "daily_rate", label: "Daily Rate" },
];

const MaintenanceRulesUI = () => {
  const [rules, setRules] = useState([
    {
      _id: "1",
      bhkType: "2BHK",
      amount: 3500,
      dueDay: 5,
      gracePeriod: 3,
      penaltyType: "percentage_of_maintenance",
      penaltyValue: 5,
      active: true,
    },
    {
      _id: "2",
      bhkType: "3BHK",
      amount: 5000,
      dueDay: 5,
      gracePeriod: 3,
      penaltyType: "fixed_amount",
      penaltyValue: 200,
      active: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    bhkType: "1BHK",
    amount: "",
    dueDay: "",
    gracePeriod: "",
    penaltyType: "fixed_amount",
    penaltyValue: "",
    active: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (editingRule) {
      setRules((prev) =>
        prev.map((rule) =>
          rule._id === editingRule._id
            ? { ...formData, _id: editingRule._id }
            : rule
        )
      );
    } else {
      setRules((prev) => [
        ...prev,
        { ...formData, _id: Date.now().toString() },
      ]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      bhkType: "1BHK",
      amount: "",
      dueDay: "",
      gracePeriod: "",
      penaltyType: "fixed_amount",
      penaltyValue: "",
      active: true,
    });
    setEditingRule(null);
    setShowModal(false);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      setRules((prev) => prev.filter((rule) => rule._id !== id));
    }
  };

  const toggleStatus = (id) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule._id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const getPenaltyDisplay = (rule) => {
    switch (rule.penaltyType) {
      case "fixed_amount":
        return `₹${rule.penaltyValue}`;
      case "percentage_of_maintenance":
        return `${rule.penaltyValue}%`;
      case "daily_rate":
        return `₹${rule.penaltyValue}/day`;
      default:
        return rule.penaltyValue;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Maintenance Rules
              </h1>
              <p className="text-gray-500 mt-1">
                Manage monthly maintenance charges and penalties
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add New Rule
            </button>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule) => (
            <div
              key={rule._id}
              className={`bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 ${
                !rule.active ? "opacity-60" : ""
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {rule.bhkType}
                    </h3>
                    <p className="text-sm text-gray-500">Unit Type</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(rule._id)}
                  className={`p-2 rounded-lg transition-all ${
                    rule.active
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {rule.active ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Amount */}
              <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-gray-600">
                    Monthly Maintenance
                  </span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{rule.amount.toLocaleString()}
                </p>
              </div>

              {/* Details Grid */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Due Day</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {rule.dueDay}th of month
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Grace Period</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {rule.gracePeriod} days
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Late Penalty</span>
                  </div>
                  <span className="font-semibold text-red-600">
                    {getPenaltyDisplay(rule)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(rule)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(rule._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {rules.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Maintenance Rules
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first maintenance rule to get started
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Add First Rule
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingRule
                    ? "Edit Maintenance Rule"
                    : "Add New Maintenance Rule"}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* BHK Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit Type (BHK)
                  </label>
                  <select
                    name="bhkType"
                    value={formData.bhkType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {UNIT_BHK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Maintenance Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="0"
                  />
                </div>

                {/* Due Day */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Day (Day of Month)
                  </label>
                  <input
                    type="number"
                    name="dueDay"
                    value={formData.dueDay}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., 5 for 5th of every month"
                    min="1"
                    max="31"
                  />
                </div>

                {/* Grace Period */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grace Period (Days)
                  </label>
                  <input
                    type="number"
                    name="gracePeriod"
                    value={formData.gracePeriod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Number of days"
                    min="0"
                  />
                </div>

                {/* Penalty Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Penalty Type
                  </label>
                  <select
                    name="penaltyType"
                    value={formData.penaltyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {PENALTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Penalty Value */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Penalty Value
                    {formData.penaltyType === "percentage_of_maintenance" &&
                      " (%)"}
                    {formData.penaltyType === "fixed_amount" && " (₹)"}
                    {formData.penaltyType === "daily_rate" && " (₹/day)"}
                  </label>
                  <input
                    type="number"
                    name="penaltyValue"
                    value={formData.penaltyValue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter penalty value"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="active"
                    id="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="active"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Active Rule (uncheck to disable)
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    {editingRule ? "Update Rule" : "Create Rule"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRulesUI;
