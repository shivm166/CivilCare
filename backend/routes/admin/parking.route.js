import { Router } from "express";
import {
  allocateUnitParking,
  allocateGeneralParking,
  getAllParkings,
  getParkingById,
  updateParking,
  deleteParking,
  getMyParking,
} from "../../controllers/admin/parking.controllers.js";
import {
  validateUnitParkingAllocation,
  validateGeneralParkingAllocation,
  validateParkingUpdate,
} from "../../validatores/validation.parking.js";
import protectRoute, { requireAdmin } from "../../middleware/isProtected.js"; // ✅ CHANGED: Use protectRoute instead of authenticateToken
import attachSocietyContext from "../../middleware/attachSocietyContext.js";

const router = Router();

// ✅ CHANGED: Use protectRoute (which checks cookies) instead of authenticateToken
router.use(protectRoute);
router.use(attachSocietyContext);

// ==================== ADMIN ROUTES ====================
router.post(
  "/unit-parking",
  requireAdmin, // ✅ CHANGED: Use requireAdmin from isProtected.js
  validateUnitParkingAllocation,
  allocateUnitParking
);

router.post(
  "/general-parking",
  requireAdmin, // ✅ CHANGED
  validateGeneralParkingAllocation,
  allocateGeneralParking
);

router.get("/", requireAdmin, getAllParkings); // ✅ CHANGED

router.get("/:parkingId", requireAdmin, getParkingById); // ✅ CHANGED

router.put("/:parkingId", requireAdmin, validateParkingUpdate, updateParking); // ✅ CHANGED

router.delete("/:parkingId", requireAdmin, deleteParking); // ✅ CHANGED

// ==================== USER ROUTES ====================
router.get("/user/my-parking", getMyParking);

export default router;
