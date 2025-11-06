import { Router } from "express";
import protectRoute from "../middlelware/isProtected.js";
import { validateRequest } from "../middlelware/validateMiddleware.js";
import {
  validateSocietyCreate,
  validateSocietyUpdate,
  validateSocietyId,
} from "../middlelware/validation.society.js";

import {
  createSociety,
  getAllSocieties,
  getSocietyById,
  updateSociety,
  deleteSociety,
} from "../controllers/society.controllers.js";

const router = Router();

// ✅ CREATE
router.post(
  "/add",
  protectRoute,
  validateRequest(validateSocietyCreate),
  createSociety
);

// ✅ READ ALL
router.get("/", protectRoute, getAllSocieties);

// ✅ READ SINGLE
router.get(
  "/:id",
  protectRoute,
  validateRequest(validateSocietyId, "params"),
  getSocietyById
);

// ✅ UPDATE
router.put(
  "/:id",
  protectRoute,
  validateRequest(validateSocietyId, "params"),
  validateRequest(validateSocietyUpdate),
  updateSociety
);

// ✅ DELETE
router.delete(
  "/:id",
  protectRoute,
  validateRequest(validateSocietyId, "params"),
  deleteSociety
);

export default router;
