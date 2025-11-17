import { Router } from "express";
import { assignResidentToUnit, deleteUnit, updateUnit } from "../../../../controllers/admin/unit.controllers.js";
import { validateRequest } from "../../../../middlelware/validateMiddleware.js";
import { validateAssignResident, validateUnitUpdate } from "../../../../middlelware/validation.unit.js";

const router = Router()

router.route("/:unitId")
                .patch(validateRequest(validateUnitUpdate), updateUnit)
                .delete(deleteUnit)

router.route("/:unitId/assign-resident")
                .post(validateRequest(validateAssignResident), assignResidentToUnit)

export default router