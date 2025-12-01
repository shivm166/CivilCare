import express from "express";
import {
  postMaintanenceRule,
  getMaintanenceRules,
  updateMaintenanceRule,
  deleteMaintenanceRule,
} from "../controllers/Maintenance/maintenance_rule.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import { validateSociety } from "../middleware/society.middleware.js";

const router = express.Router();

// All routes require authentication and society validation
router.use(protect, validateSociety);

// GET all maintenance rules for society
router.get("/", getMaintanenceRules);

// Admin only routes
router.post("/", adminOnly, postMaintanenceRule);
router.put("/:id", adminOnly, updateMaintenanceRule);
router.delete("/:id", adminOnly, deleteMaintenanceRule);

export default router;
