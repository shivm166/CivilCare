import express from "express";
import {
  deleteMaintenanceRule,
  getMaintanenceRules,
  postMaintanenceRule,
  updateMaintenanceRule,
} from "../../../../controllers/maintenance/maintenance_rule.controllers.js";

const router = express.Router();

router.route("/").post(postMaintanenceRule).get(getMaintanenceRules);

router.route("/:id").put(updateMaintenanceRule).delete(deleteMaintenanceRule);
export default router;
