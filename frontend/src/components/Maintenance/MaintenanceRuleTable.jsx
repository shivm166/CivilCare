import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

// Assuming this table will display maintenance rules
const MaintenanceRuleTable = ({ rules = [] }) => {
  if (rules.length === 0) {
    return <p className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">No maintenance rules defined yet.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BHK Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Day</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty Type</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rules.map((rule) => (
            <tr key={rule._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rule.bhkType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rule.amount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Day {rule.dueDay} (Grace: {rule.gracePeriod} days)</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{rule.penaltyType} ({rule.penaltyValue} {rule.penaltyType.includes('percentage') ? '%' : '₹'})</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-center">
                <button
                  onClick={() => alert(`Edit rule ${rule._id}`)}
                  className="text-indigo-600 hover:text-indigo-900 mx-2"
                >
                  <Edit className="w-4 h-4 inline" />
                </button>
                <button
                  onClick={() => alert(`Delete rule ${rule._id}`)}
                  className="text-red-600 hover:text-red-900 mx-2"
                >
                  <Trash2 className="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceRuleTable;