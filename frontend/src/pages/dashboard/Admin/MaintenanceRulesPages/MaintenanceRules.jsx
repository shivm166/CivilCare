import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  IndianRupee,
  Calendar,
  AlertTriangle,
  X,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import {
  useGetMaintenanceRules,
  useCreateMaintenanceRule,
  useUpdateMaintenanceRule,
  useDeleteMaintenanceRule,
} from "../../../../hooks/api/usemaintenance";
import PageLoader from "../../../error/PageLoader";
import Button from "../../../../components/common/Button/Button";
import { UNIT_BHK_TYPES } from "../../../../config/unit.config";

const MaintenanceRules = () => {
  const { activeSocietyId } = useSocietyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // Initial Form State
  const initialFormState = {
    bhkType: UNIT_BHK_TYPES[0] || "1bhk",
    amount: "",
    dueDay: "",
    gracePeriod: "0",
    penaltyType: "fixed_amount",
    penaltyValue: "",
    active: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  // React Query Hooks
  const { data: rules, isLoading } = useGetMaintenanceRules(activeSocietyId);
  const { mutate: createRule, isPending: isCreating } =
    useCreateMaintenanceRule();
  const { mutate: updateRule, isPending: isUpdating } =
    useUpdateMaintenanceRule();
  const { mutate: deleteRule, isPending: isDeleting } =
    useDeleteMaintenanceRule();

  const handleOpenModal = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        bhkType: rule.bhkType,
        amount: rule.amount,
        dueDay: rule.dueDay,
        gracePeriod: rule.gracePeriod,
        penaltyType: rule.penaltyType,
        penaltyValue: rule.penaltyValue,
        active: rule.active,
      });
    } else {
      setEditingRule(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRule) {
      updateRule(
        { id: editingRule._id, ...formData },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createRule(formData, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      deleteRule(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-indigo-600" /> Maintenance Rules
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Set monthly maintenance charges and penalties for unit types.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          icon={Plus}
          className="w-full sm:w-auto"
        >
          Add New Rule
        </Button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <IndianRupee className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Rules Defined
            </h3>
            <p className="text-gray-500 mb-6">
              Start by creating a maintenance rule for your society.
            </p>
            <Button variant="secondary" onClick={() => handleOpenModal()}>
              Create Rule
            </Button>
          </div>
        ) : (
          rules?.map((rule) => (
            <div
              key={rule._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden relative group"
            >
              {/* Status Indicator */}
              <div
                className={`absolute top-0 right-0 w-3 h-3 m-3 rounded-full ${
                  rule.active ? "bg-green-500" : "bg-gray-300"
                }`}
                title={rule.active ? "Active" : "Inactive"}
              ></div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-100">
                    {rule.bhkType}
                  </span>
                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(rule)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(rule._id)}
                      disabled={isDeleting}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-gray-900">
                    ₹{rule.amount.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    / month
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} /> Due Date
                    </div>
                    <span className="font-semibold text-gray-900">
                      {rule.dueDay}th of month
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 size={14} /> Grace Period
                    </div>
                    <span className="font-semibold text-gray-900">
                      {rule.gracePeriod} Days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm items-center bg-red-50 p-2 rounded-lg mt-2">
                    <div className="flex items-center gap-2 text-red-600 font-medium">
                      <AlertTriangle size={14} /> Penalty
                    </div>
                    <span className="font-bold text-red-700 text-xs">
                      {rule.penaltyType === "fixed_amount"
                        ? `₹${rule.penaltyValue}`
                        : rule.penaltyType === "percentage_of_maintenance"
                        ? `${rule.penaltyValue}%`
                        : `₹${rule.penaltyValue} / Day`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-gray-800">
                {editingRule ? "Edit Rule" : "Create Maintenance Rule"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Unit Type
                  </label>
                  <select
                    name="bhkType"
                    value={formData.bhkType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    disabled={!!editingRule} // Prevent changing type on edit to avoid conflicts
                  >
                    {UNIT_BHK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g. 2500"
                    required
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Due Day
                    </label>
                    <input
                      type="number"
                      name="dueDay"
                      value={formData.dueDay}
                      onChange={handleInputChange}
                      placeholder="1-31"
                      required
                      min="1"
                      max="31"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Grace (Days)
                    </label>
                    <input
                      type="number"
                      name="gracePeriod"
                      value={formData.gracePeriod}
                      onChange={handleInputChange}
                      placeholder="e.g. 5"
                      required
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Penalty Section */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
                  <p className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle size={12} /> Penalty Settings
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Penalty Type
                    </label>
                    <select
                      name="penaltyType"
                      value={formData.penaltyType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                    >
                      <option value="fixed_amount">Fixed Amount (₹)</option>
                      <option value="percentage_of_maintenance">
                        % of Maintenance
                      </option>
                      <option value="daily_rate">Daily Rate (₹ per day)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Penalty Value
                    </label>
                    <input
                      type="number"
                      name="penaltyValue"
                      value={formData.penaltyValue}
                      onChange={handleInputChange}
                      placeholder="e.g. 100"
                      required
                      min="0"
                      className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex gap-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isCreating || isUpdating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                >
                  {editingRule ? "Save Changes" : "Create Rule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRules;
