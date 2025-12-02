import express from "express";
import {
  postMaintanenceRule,
  getMaintanenceRules,
  updateMaintenanceRule,
  deleteMaintenanceRule,
} from "../controllers/maintenance/maintenance_Rule.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateSociety } from "../middleware/society.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

// Apply auth + society middleware to all routes
router.use(protect, validateSociety);

// CRUD Routes
router.get("/", getMaintanenceRules);
router.post("/", adminOnly, postMaintanenceRule);
router.put("/:id", adminOnly, updateMaintenanceRule);
router.delete("/:id", adminOnly, deleteMaintenanceRule);

export default router;
