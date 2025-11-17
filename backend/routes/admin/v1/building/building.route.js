import { Router } from "express"
import { createBuilding, deleteBuilding, getAllBuildings, getBuildingById, updateBuilding } from "../../../../controllers/admin/building.controllers.js"
import { validateRequest } from "../../../../middlelware/validateMiddleware.js"
import { validateBuildingCreate, validateBuildingUpdate } from "../../../../middlelware/validation.building.js"
import { createUnit, getUnitsInBuilding } from "../../../../controllers/admin/unit.controllers.js"
import { validateUnitCreate } from "../../../../middlelware/validation.unit.js"

const router = Router()

router.route("/")
    .post(validateRequest(validateBuildingCreate), createBuilding)
    .get(getAllBuildings)

router.route("/:id")
    .get(getBuildingById)
    .patch(validateRequest(validateBuildingUpdate), updateBuilding)
    .delete(deleteBuilding)

router.route("/:buildingId/unit")
                .post(validateRequest(validateUnitCreate), createUnit)
                .get(getUnitsInBuilding)

export default router
