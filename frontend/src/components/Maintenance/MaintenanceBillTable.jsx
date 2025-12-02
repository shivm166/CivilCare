import React from "react";
import StatusBadge from "../common/StatusBadge/StatusBadge.jsx";

// Assuming this table will display generated bills
const MaintenanceBillTable = ({ bills = [] }) => {
  if (bills.length === 0) {
    return (
      <p className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
        No maintenance bills have been generated yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resident
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              For Month
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount (₹)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bills.map((bill) => (
            <tr key={bill._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {bill.unit?.unitNumber || "N/A"} ({bill.unit?.bhkType || "N/A"})
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {bill.resident?.name || "Unassigned"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {bill.forMonth}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {bill.totalAmount.toFixed(2)}
                {bill.lateFeeApplied > 0 && (
                  <span className="text-red-500 text-xs ml-1">
                    (+{bill.lateFeeApplied.toFixed(2)} late fee)
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={bill.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceBillTable;
