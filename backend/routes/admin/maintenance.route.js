import { Router } from "express";
import {
  createMaintenanceRule,
  getAllRules,
  getRuleById,
  updateMaintenanceRule,
  deleteMaintenanceRule,
  toggleRuleStatus,
  getMyApplicableMaintenance,
} from "../../controllers/admin/maintenance.controllers.js";
import { validateRequest } from "../../validatores/validateMiddleware.js";
import {
  validateRuleCreate,
  validateRuleUpdate,
} from "../../validatores/validation.maintenance.js";
import protectRoute, { requireAdmin } from "../../middleware/isProtected.js";
import attachSocietyContext from "../../middleware/attachSocietyContext.js";

const router = Router();

router.use(protectRoute);
router.use(attachSocietyContext);

router.post(
  "/rules",
  requireAdmin,
  validateRequest(validateRuleCreate),
  createMaintenanceRule
);
router.get("/rules", requireAdmin, getAllRules);
router.get("/rules/:ruleId", requireAdmin, getRuleById);
router.put(
  "/rules/:ruleId",
  requireAdmin,
  validateRequest(validateRuleUpdate),
  updateMaintenanceRule
);
router.delete("/rules/:ruleId", requireAdmin, deleteMaintenanceRule);
router.patch("/rules/:ruleId/toggle-status", requireAdmin, toggleRuleStatus);
router.get("/user/applicable", getMyApplicableMaintenance);

export default router;
