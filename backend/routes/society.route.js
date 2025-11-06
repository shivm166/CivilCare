import { Router } from "express";
import { validateSocietyCreate } from "../middlelware/validation.society.js";
import { validateRequest } from "../middlelware/validateMiddleware.js";
import { createSociety, deleteSociety, getMySocieties, getSocietyById, updateSociety } from "../controllers/society.controllers.js";
import protectRoute from "../middlelware/isProtected.js";

const router = Router()

router.post("/add",protectRoute, validateRequest(validateSocietyCreate), createSociety)
router.get("/mysocieties", protectRoute, getMySocieties)
router.get("/:id", protectRoute, getSocietyById)
router.patch("/:id", protectRoute, updateSociety)
router.delete("/:id", protectRoute, deleteSociety)

export default router