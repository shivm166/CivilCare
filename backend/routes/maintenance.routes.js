import express from "express";
import {
  postMaintanenceRule,
  getMaintanenceRules,
  updateMaintenanceRule,
  deleteMaintenanceRule,
} from "../controllers/maintenance/maintenance.js";
import protectRoute, { requireAdmin } from "../middleware/isProtected.js";
import attachSocietyContext from "../middleware/attachSocietyContext.js";

const router = express.Router();

router.use(protectRoute);
router.use(attachSocietyContext);

router.get("/", getMaintanenceRules);

router.post("/", requireAdmin, postMaintanenceRule);
router.put("/:id", requireAdmin, updateMaintenanceRule);
router.delete("/:id", requireAdmin, deleteMaintenanceRule);

export default router;
