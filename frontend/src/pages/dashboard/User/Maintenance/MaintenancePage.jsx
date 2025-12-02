// /frontend/src/pages/dashboard/User/Maintenance/MaintenancePage.jsx

import React, { useState } from "react";
import Container from "../../../../components/layout/Container/Container.jsx";
import {
  useUserMaintenanceBills,
  usePayMaintenance,
} from "../../../../hooks/api/useMaintenance.js"; // assumed path
import StatusBadge from "../../../../components/common/StatusBadge/StatusBadge.jsx"; // assumed path

// Assume a dedicated modal for payment
import PaymentModal from "./components/PaymentModal.jsx";

const UserMaintenancePage = () => {
  const { data: bills, isLoading, isError } = useUserMaintenanceBills();
  const [selectedBill, setSelectedBill] = useState(null);

  if (isLoading)
    return (
      <Container>
        <p>Loading your maintenance bills...</p>
      </Container>
    );
  if (isError || !bills)
    return (
      <Container>
        <p className="text-red-600">
          Error fetching maintenance records. Please try again.
        </p>
      </Container>
    );

  return (
    <Container>
      <h2 className="text-2xl font-bold mb-6">🏡 Your Maintenance Records</h2>

      {bills.length === 0 ? (
        <p className="p-4 bg-yellow-100 border border-yellow-300 rounded">
          No maintenance bills found for your unit yet.
        </p>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => (
            <div
              key={bill._id}
              className="p-4 border rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Bill for: {bill.forMonth}
                  <span className="text-sm text-gray-500 ml-2">
                    ({bill.unit?.unitNumber} - {bill.unit?.bhkType})
                  </span>
                </p>
                <p className="text-sm">
                  Due Date: {new Date(bill.dueDate).toLocaleDateString()}
                </p>
                <p className="text-lg font-bold mt-1">
                  Total Due: ₹{bill.totalAmount.toFixed(2)}
                </p>
                {bill.lateFeeApplied > 0 && (
                  <p className="text-xs text-red-500">
                    Includes Late Fee: ₹{bill.lateFeeApplied.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status={bill.status} />
                {bill.status !== "paid" ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedBill(bill)}
                  >
                    Pay Now
                  </button>
                ) : (
                  <span className="text-green-600 font-semibold">
                    Paid on: {new Date(bill.paidAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {selectedBill && (
        <PaymentModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </Container>
  );
};

export default UserMaintenancePage;
