import express from "express";

import {
  postMaintanenceRule,
  getMaintanenceRules,
  getMaintenanceRuleById,
  updateMaintenanceRule,
  deleteMaintenanceRule,
  generateMaintenanceBill,
  getMaintenanceBills,
  getMaintenanceBillById,
  deleteMaintenanceBill,
  recordMaintenancePayment,
  getAllMaintenancePayments,
  getMaintenanceRecord,
  getMaintenancePaymentById,
  deleteMaintenancePayment,
  getUserMaintenanceBills,
  getUnitsBySocietyForAdmin,
} from "../../../../controllers/maintenance/maintenance.js";

const router = express.Router();

// ADMIN: RULE ROUTES

router.route("/rule").post(postMaintanenceRule).get(getMaintanenceRules);

router
  .route("/rule/:id")
  .get(getMaintenanceRuleById)
  .put(updateMaintenanceRule)
  .delete(deleteMaintenanceRule);

// ADMIN: BILL ROUTES

router.route("/bill").post(generateMaintenanceBill).get(getMaintenanceBills);

router
  .route("/bill/:id")
  .get(getMaintenanceBillById)
  .delete(deleteMaintenanceBill);

//USER: BILL ROUTES
router.get("/user/bills", getUserMaintenanceBills);

//  ADMIN + USER: PAYMENT ROUTES

router
  .route("/payment")
  .post(recordMaintenancePayment)
  .get(getAllMaintenancePayments);

router.get("/payment/:billId", getMaintenanceRecord);
router.get("/payment/view/:id", getMaintenancePaymentById);
router.delete("/payment/delete/:id", deleteMaintenancePayment);

// ADMIN: UNIT ROUTES

router.get("/units", getUnitsBySocietyForAdmin);

export default router;
