import express from "express";
import {
  deleteMaintenanceRule,
  getAllMaintenancePayments,
  getMaintanenceRules,
  getMaintenanceRecord,
  postMaintanenceRule,
  recordMaintenancePayment,
  updateMaintenanceRule,
} from "../../../../controllers/maintenance/maintenance_rule.controllers.js";

const router = express.Router();
//rule route
router.route("/").post(postMaintanenceRule).get(getMaintanenceRules);
router.route("/:id").put(updateMaintenanceRule).delete(deleteMaintenanceRule);

//payment route
router
  .route("/payment")
  .post(recordMaintenancePayment)
  .get(getAllMaintenancePayments);

router.route("/payment/:id").get(getMaintenanceRecord);
export default router;
