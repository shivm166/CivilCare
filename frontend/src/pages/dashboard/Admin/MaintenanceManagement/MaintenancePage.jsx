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

const MaintenancePage = () => {
  const { activeSocietyId } = useSocietyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const initialFormState = {
    bhkType: UNIT_BHK_TYPES[0] || "1BHK",
    amount: "",
    dueDay: "",
    gracePeriod: "0",
    penaltyType: "fixed_amount",
    penaltyValue: "",
    active: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  const { data: rules, isLoading } = useGetMaintenanceRules(activeSocietyId);
  const { mutate: createRule, isPending: isCreating } =
    useCreateMaintenanceRule();
  const { mutate: updateRule, isPending: isUpdating } =
    useUpdateMaintenanceRule();
  const { mutate: deleteRule, isPending: isDeleting } =
    useDeleteMaintenanceRule();

  const rulesList = rules || [];

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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    if (window.confirm("Are you sure you want to delete this rule?"))
      deleteRule(id);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-indigo-600" /> Maintenance Rules
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Set monthly maintenance rates for each BHK type.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rulesList.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-dashed border-2 border-gray-300">
            <IndianRupee className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Rules Found
            </h3>
            <p className="text-gray-500 mb-4">
              Start by creating maintenance rules.
            </p>
            <Button variant="secondary" onClick={() => handleOpenModal()}>
              Create Rulee
            </Button>
          </div>
        ) : (
          rulesList.map((rule) => (
            <div
              key={rule._id}
              className="bg-white rounded-2xl border shadow-sm p-5 relative"
            >
              <div
                className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
                  rule.active ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold">
                  {rule.bhkType}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(rule)}
                    className="p-2 hover:text-indigo-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(rule._id)}
                    disabled={isDeleting}
                    className="p-2 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="text-3xl font-extrabold text-gray-900 mb-2">
                ₹{Number(rule.amount).toLocaleString()}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Calendar size={14} /> Due
                  </span>
                  <span className="font-semibold">{rule.dueDay}th</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-gray-600">
                    <CheckCircle2 size={14} /> Grace
                  </span>
                  <span className="font-semibold">{rule.gracePeriod} days</span>
                </div>
                <div className="flex justify-between bg-red-50 p-2 rounded-lg">
                  <span className="flex items-center gap-1 text-red-700 font-semibold">
                    <AlertTriangle size={14} /> Penalty
                  </span>
                  <span className="text-red-700 font-bold text-xs">
                    {rule.penaltyType === "fixed_amount"
                      ? `₹${rule.penaltyValue}`
                      : rule.penaltyType === "percentage_of_maintenance"
                      ? `${rule.penaltyValue}%`
                      : `₹${rule.penaltyValue} / day`}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {editingRule ? "Edit Rule" : "Create Rule"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>Unit Type</label>
                <select
                  name="bhkType"
                  disabled={!!editingRule}
                  value={formData.bhkType}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                >
                  {UNIT_BHK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                className="w-full border p-2 rounded-md"
                required
              />

              <input
                type="number"
                name="dueDay"
                value={formData.dueDay}
                onChange={handleInputChange}
                placeholder="Due day"
                className="w-full border p-2 rounded-md"
                required
              />

              <input
                type="number"
                name="gracePeriod"
                value={formData.gracePeriod}
                onChange={handleInputChange}
                placeholder="Grace days"
                className="w-full border p-2 rounded-md"
                required
              />

              <select
                name="penaltyType"
                value={formData.penaltyType}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md"
              >
                <option value="fixed_amount">Fixed Amount</option>
                <option value="percentage_of_maintenance">
                  % of Maintenance
                </option>
                <option value="daily_rate">Daily Rate</option>
              </select>

              <input
                type="number"
                name="penaltyValue"
                value={formData.penaltyValue}
                onChange={handleInputChange}
                placeholder="Penalty Value"
                className="w-full border p-2 rounded-md"
                required
              />

              <Button
                type="submit"
                isLoading={isCreating || isUpdating}
                className="w-full"
              >
                {editingRule ? "Save Changes" : "Create Rule"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
