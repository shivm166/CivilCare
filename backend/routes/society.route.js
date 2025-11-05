import { Router } from "express";
import { validateSocietyCreate } from "../middlelware/validation.society.js";
import { validateRequest } from "../middlelware/validateMiddleware.js";
import { createSociety } from "../controllers/society.controllers.js";
import protectRoute from "../middlelware/isProtected.js";

const router = Router()

router.post("/add",protectRoute, validateRequest(validateSocietyCreate), createSociety)

export default router