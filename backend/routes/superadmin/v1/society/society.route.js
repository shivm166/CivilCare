import { Router } from "express"
import { createSociety, deleteSociety, getMySocieties, updateSociety } from "../../../../controllers/society.controllers.js"

const router = Router()

router.route("/")
                .post(createSociety)
                .get(getMySocieties)
                .patch(updateSociety)
router.route("/:id").delete(deleteSociety)

export default router