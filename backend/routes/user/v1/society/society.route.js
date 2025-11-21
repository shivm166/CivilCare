import { Router } from "express";
import protectRoute from "../../../../middleware/isProtected.js";
import { validateSocietyCreate } from "../../../../middleware/validation.society.js";
import { createSociety, deleteSociety, getMySocieties, getSocietyById, updateSociety } from "../../../../controllers/user/society.controllers.js";
import { validateRequest } from "../../../../middleware/validateMiddleware.js";

const router = Router();

router.post(
  "/add",
  protectRoute,
  validateRequest(validateSocietyCreate),
  createSociety
);
router.get("/mysocieties", protectRoute, getMySocieties);
router.get("/:id", protectRoute, getSocietyById);
router.patch("/:id", protectRoute, updateSociety);
router.delete("/:id", protectRoute, deleteSociety);
router.get("/:id", getSocietyById); // dynamic route ALWAYS LAST

export default router;
