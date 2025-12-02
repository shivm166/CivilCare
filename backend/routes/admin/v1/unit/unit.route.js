import { Router } from "express";
import {
  assignResidentToUnit,
  deleteUnit,
  getUnitById,
  updateUnit,
} from "../../../../controllers/admin/unit.controllers.js";
import { validateRequest } from "../../../../validatores/validateMiddleware.js";
import {
  validateAssignResident,
  validateUnitUpdate,
} from "../../../../validatores/validation.unit.js";
import { getUnitsBySocietyForAdmin } from "../../../../controllers/maintenance/maintenance.js";

const router = Router();

router.route("/")
    .get(getUnitsBySocietyForAdmin);
router
  .route("/:unitId")
  .get(getUnitById)
  .patch(validateRequest(validateUnitUpdate), updateUnit)
  .delete(deleteUnit);

router
  .route("/:unitId/assign-resident")
  .post(validateRequest(validateAssignResident), assignResidentToUnit);

export default router;
