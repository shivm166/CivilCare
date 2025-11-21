import { Router } from "express"
import { createSociety, deleteSociety, getAllSocieties, getAllSocietiesWithUserCount, getSocietyById, updateSociety } from "../../../../controllers/superadmin/society.controllers.js"

const router = Router()

router.route("/")
                .post(createSociety)
                .get(getAllSocietiesWithUserCount)

router.route("/:id")
                .get(getSocietyById)
                .delete(deleteSociety)
                .patch(updateSociety)

export default router