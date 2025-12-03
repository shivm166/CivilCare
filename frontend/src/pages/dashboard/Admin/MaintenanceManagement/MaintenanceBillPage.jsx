import React, { useState } from "react";
import {
  Plus,
  FileText,
  IndianRupee,
  Calendar,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import {
  useGetMaintenanceRules,
  useGetUnitsForBillGeneration,
  useGenerateMaintenanceBill,
  useGetAllMaintenanceBills,
} from "../../../../hooks/api/usemaintenance";
import PageLoader from "../../../error/PageLoader";
import Button from "../../../../components/common/Button/Button";
import Card from "../../../../components/common/Card/Card";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "text-green-600 bg-green-50 border-green-200";
    case "overdue":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
  }
};

const MaintenanceBillPage = () => {
  const { activeSocietyId } = useSocietyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    unitId: "",
    ruleId: "",
    forMonth: new Date().toISOString().substring(0, 7),
  });

  const { data: bills, isLoading: isBillsLoading } =
    useGetAllMaintenanceBills(activeSocietyId);
  const { data: rules, isLoading: isRulesLoading } =
    useGetMaintenanceRules(activeSocietyId);
  const { data: units, isLoading: isUnitsLoading } =
    useGetUnitsForBillGeneration(activeSocietyId);
  const { mutate: generateBill, isPending: isGenerating } =
    useGenerateMaintenanceBill();

  const rulesList = Array.isArray(rules) ? rules : [];
  const unitsList = Array.isArray(units) ? units : [];
  const billsList = Array.isArray(bills) ? bills : [];

  const selectedRule = rulesList.find((r) => r._id === formData.ruleId);
  const selectedUnit = unitsList.find((u) => u._id === formData.unitId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.unitId || !formData.ruleId || !formData.forMonth) return;
    generateBill(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({
          unitId: "",
          ruleId: "",
          forMonth: new Date().toISOString().substring(0, 7),
        });
      },
    });
  };

  const isDataLoading = isBillsLoading || isRulesLoading || isUnitsLoading;

  if (isDataLoading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <Card className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IndianRupee className="text-indigo-600" /> Maintenance Bill
            Generation
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Generate and track monthly maintenance bills for all units.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
          className="w-full sm:w-auto"
          disabled={rulesList.length === 0 || unitsList.length === 0}
        >
          Generate New Bill
        </Button>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
          All Maintenance Bills
        </h2>
        {billsList.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Bills Generated Yet
            </h3>
            <p className="text-gray-500">
              Start by creating rules and generating the first maintenance bill.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {billsList.map((bill) => (
              <div
                key={bill._id}
                className={`bg-white rounded-xl shadow-sm p-4 space-y-3 border-l-4 ${
                  bill.status === "paid"
                    ? "border-green-500"
                    : bill.status === "overdue"
                    ? "border-red-500"
                    : "border-yellow-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-gray-700">
                    {bill.forMonth} - {bill.unit?.unitNumber}
                  </span>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
                      bill.status
                    )}`}
                  >
                    {bill.status}
                  </div>
                </div>

                <div className="text-2xl font-extrabold text-indigo-700 flex items-center gap-1">
                  ₹{Number(bill.totalAmount || bill.amount).toLocaleString()}
                </div>

                <div className="space-y-1 text-sm pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Resident:</span>
                    <span className="font-medium text-gray-900">
                      {bill.resident?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Base Amount:</span>
                    <span className="font-medium text-gray-900">
                      ₹{Number(bill.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Late Fee:</span>
                    <span className="font-medium text-red-600">
                      + ₹{Number(bill.lateFeeApplied || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> Due Date:
                    </span>
                    <span className="font-medium">
                      {formatDate(bill.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-indigo-800">
                Generate Maintenance Bill
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Unit to Bill
                  </label>
                  <select
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl"
                    required
                  >
                    <option value="">Select Unit</option>
                    {unitsList.map((unit) => (
                      <option key={unit._id} value={unit._id}>
                        {unit.building} - {unit.unitNumber} ({unit.bhkType})
                        {unit.resident
                          ? ` - ${unit.resident.name}`
                          : " (Vacant)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Maintenance Rule
                  </label>
                  <select
                    name="ruleId"
                    value={formData.ruleId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl"
                    required
                  >
                    <option value="">Select Rule (Filter by BHK Type)</option>
                    {rulesList.map((rule) => (
                      <option key={rule._id} value={rule._id}>
                        {rule.bhkType} - ₹{rule.amount} (Due: {rule.dueDay}th)
                      </option>
                    ))}
                  </select>

                  {selectedUnit &&
                    selectedRule &&
                    selectedUnit.bhkType !== selectedRule.bhkType && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle size={12} /> Warning: Unit is{" "}
                        {selectedUnit.bhkType}, Rule is {selectedRule.bhkType}.
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Bill For Month (YYYY-MM)
                  </label>
                  <input
                    type="month"
                    name="forMonth"
                    value={formData.forMonth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                  />
                </div>

                {selectedRule && selectedUnit && selectedUnit.resident && (
                  <div className="bg-green-50 p-4 rounded-xl text-sm text-green-800 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Ready to Generate:
                    </p>
                    <p>
                      Unit: <strong>{selectedUnit.unitNumber}</strong> (
                      {selectedUnit.bhkType})
                    </p>
                    <p>
                      Resident: <strong>{selectedUnit.resident.name}</strong>
                    </p>
                    <p>
                      Amount: <strong>₹{selectedRule.amount}</strong>
                    </p>
                  </div>
                )}

                {selectedUnit && !selectedUnit.resident && (
                  <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-800">
                    <p className="font-bold flex items-center gap-1">
                      <AlertTriangle size={14} /> Warning: Unit{" "}
                      {selectedUnit.unitNumber} is vacant.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isGenerating}
                  className="flex-1 bg-indigo-600 text-white"
                  disabled={
                    !formData.unitId || !formData.ruleId || isGenerating
                  }
                >
                  Generate Bill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceBillPage;
