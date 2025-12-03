import React, { useState } from "react";
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import {
  useGetUserMaintenanceBills,
  usePayMaintenanceBill,
} from "../../../../hooks/api/usemaintenance";
import PageLoader from "../../../error/PageLoader";
import Button from "../../../../components/common/Button/Button";
import PaymentModal from "./components/PaymentModal";

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

const MaintenancePage = () => {
  const { activeSocietyId } = useSocietyContext();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const { data: billsData, isLoading } =
    useGetUserMaintenanceBills(activeSocietyId);
  const { mutate: payBill, isPending: isPaying } = usePayMaintenanceBill();

  const billsList = Array.isArray(billsData)
    ? billsData
    : Array.isArray(billsData?.bills)
    ? billsData.bills
    : [];

  const handlePayClick = (bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-indigo-600" /> My Maintenance Bills
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage your society maintenance bills and payments.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {billsList.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Maintenance Bills Found
            </h3>
            <p className="text-gray-500">
              Your society has not generated any maintenance bills for your unit
              yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {billsList.map((bill) => (
              <div
                key={bill._id}
                className={`bg-white rounded-2xl shadow-md border-l-4 p-5 space-y-4 ${
                  bill.status === "paid"
                    ? "border-green-500"
                    : bill.status === "overdue"
                    ? "border-red-500"
                    : "border-yellow-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-lg font-semibold text-gray-800">
                    Bill for {bill.forMonth}
                  </span>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
                      bill.status
                    )}`}
                  >
                    {bill.status}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <IndianRupee size={14} /> Amount
                    </span>
                    <span className="font-bold text-gray-900">
                      ₹{Number(bill.amount || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <AlertTriangle size={14} /> Late Fee
                    </span>
                    <span className="font-semibold text-red-600">
                      + ₹{Number(bill.lateFeeApplied || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-t mt-2 pt-2 border-gray-100">
                    <span className="text-lg font-bold text-indigo-700">
                      Total Due
                    </span>
                    <span className="text-xl font-extrabold text-indigo-800">
                      ₹
                      {Number(
                        bill.totalAmount || bill.amount || 0
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> Due Date
                    </span>
                    <span className="font-medium text-gray-700">
                      {formatDate(bill.dueDate)}
                    </span>
                  </div>

                  {bill.status === "paid" && (
                    <div className="flex justify-between pt-1">
                      <span className="text-green-600 flex items-center gap-1 font-semibold">
                        <CheckCircle2 size={14} /> Paid On
                      </span>
                      <span className="font-medium text-green-700">
                        {formatDate(bill.paidAt)}
                      </span>
                    </div>
                  )}
                </div>

                {bill.status !== "paid" && (
                  <Button
                    onClick={() => handlePayClick(bill)}
                    icon={CreditCard}
                    className="w-full mt-4"
                  >
                    Pay Now (₹
                    {Number(
                      bill.totalAmount || bill.amount || 0
                    ).toLocaleString()}
                    )
                  </Button>
                )}

                {bill.status === "paid" && (
                  <Button variant="secondary" className="w-full mt-4" disabled>
                    Payment Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isPaymentModalOpen && selectedBill && (
        <PaymentModal
          bill={selectedBill}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MaintenancePage;
