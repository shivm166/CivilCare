// /frontend/src/pages/dashboard/Admin/MaintenanceManagement/MaintenancePage.jsx

import React, { useState } from "react";
import Container from "../../../../components/layout/Container/Container.jsx"; // assumed path
import {
  useMaintenanceRules,
  useAdminMaintenanceBills,
} from "../../../../hooks/api/useMaintenance.js";

import MaintenanceBillTable from "../../../../components/Maintenance/MaintenanceBillTable.jsx";
import MaintenanceRuleFormModal from "../../../../components/Maintenance/MaintenanceRuleFormModal.jsx";
import GenerateBillFormModal from "../../../../components/Maintenance/GenerateBillFormModal.jsx";
import MaintenanceRuleTable from "../../../../components/Maintenance/MaintenanceRuleTable.jsx";

const MaintenancePage = () => {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const { data: rules, isLoading: isLoadingRules } = useMaintenanceRules();
  const { data: bills, isLoading: isLoadingBills } = useAdminMaintenanceBills();

  return (
    <Container>
      <h2 className="text-2xl font-bold mb-4">
        ⚙️ Maintenance Management (Admin)
      </h2>

      {/* Maintenance Rule Management */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Maintenance Rules (By BHK Type)
          </h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowRuleModal(true)}
          >
            + Create New Rule
          </button>
        </div>
        {isLoadingRules ? (
          <p>Loading rules...</p>
        ) : (
          <MaintenanceRuleTable rules={rules} />
        )}
        <MaintenanceRuleFormModal
          isOpen={showRuleModal}
          onClose={() => setShowRuleModal(false)}
        />
      </div>

      <hr className="my-8" />

      {/* Maintenance Bill Management */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Generated Bills</h3>
          <button
            className="btn btn-success"
            onClick={() => setShowBillModal(true)}
          >
            Generate Bills
          </button>
        </div>
        {isLoadingBills ? (
          <p>Loading bills...</p>
        ) : (
          <MaintenanceBillTable bills={bills} />
        )}
        <GenerateBillFormModal
          isOpen={showBillModal}
          onClose={() => setShowBillModal(false)}
          rules={rules} // Pass rules to select from
        />
      </div>
    </Container>
  );
};

export default MaintenancePage;
