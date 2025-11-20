import { Router } from "express";
import {
  assignResidentToUnit,
  deleteUnit,
  getUnitById,
  updateUnit,
} from "../../../../controllers/admin/unit.controllers.js";
import { validateRequest } from "../../../../middleware/validateMiddleware.js";
import {
  validateAssignResident,
  validateUnitUpdate,
} from "../../../../middleware/validation.unit.js";

const router = Router();

router
  .route("/:unitId")
  .get(getUnitById)
  .patch(validateRequest(validateUnitUpdate), updateUnit)
  .delete(deleteUnit);

router
  .route("/:unitId/assign-resident")
  .post(validateRequest(validateAssignResident), assignResidentToUnit);

export default router;
