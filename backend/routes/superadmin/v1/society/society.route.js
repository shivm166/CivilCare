import { Router } from "express"
import { createSociety, deleteSociety, getAllSocieties, updateSociety } from "../../../../controllers/superadmin/society.controllers.js"

const router = Router()

router.route("/")
                .post(createSociety)
                .get(getAllSocieties)
                .patch(updateSociety)
router.route("/:id").delete(deleteSociety)

export default router