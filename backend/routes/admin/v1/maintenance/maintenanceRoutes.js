import express from "express";
import {
  deleteMaintenanceRule,
  getAllMaintenancePayments,
  getMaintanenceRules,
  getMaintenanceRecord,
  postMaintanenceRule,
  recordMaintenancePayment,
  updateMaintenanceRule,
  generateMaintenanceBill,
  getMaintenanceBills,
  getMaintenanceBillById,
  deleteMaintenanceBill,
  getMaintenanceRuleById,
} from "../../../../controllers/maintenance/maintenance.js";
// ✨ નોંધ: getUnitsBySocietyForAdmin અહીંથી દૂર કરવામાં આવ્યું છે

const router = express.Router();

// =================================================================
// 1. RULE ROUTES (CRUD) - /admin/v1/maintenance/rule
// =================================================================
router.route("/rule").post(postMaintanenceRule).get(getMaintanenceRules);
router
  .route("/rule/:id")
  .get(getMaintenanceRuleById) // Admin: Search/Get Rule by ID
  .put(updateMaintenanceRule)
  .delete(deleteMaintenanceRule);

// =================================================================
// 2. BILL ROUTES (Generate, Get All, Get By ID, Delete) - /admin/v1/maintenance/bill
// =================================================================
router.route("/bill").post(generateMaintenanceBill).get(getMaintenanceBills);
router
  .route("/bill/:id")
  .get(getMaintenanceBillById) // Admin: Search/Get Bill by ID
  .delete(deleteMaintenanceBill);

// =================================================================
// 3. PAYMENT ROUTES (Record Payment, Get All Payments, Get Payments for a Bill)
// /admin/v1/maintenance/payment
// =================================================================
router
  .route("/payment")
  .post(recordMaintenancePayment) // Admin: Manually record payment
  .get(getAllMaintenancePayments); // Admin: Get all payment records

router.route("/payment/:billId").get(getMaintenanceRecord); // Admin: Get payments for a specific bill

export default router;