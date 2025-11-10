import { Router } from "express";
import {
  adminListComplaints,
  adminUpdateComplaint,
  createComplaint,
  getMyComplaints,
} from "../controllers/complaint.controllers.js";
import protectRoute from "../middlelware/isProtected.js";

const router = Router();

router.use(protectRoute);
// USER
router.post("/postComplaint", createComplaint);
router.get("/me", getMyComplaints);

// ADMIN
router.get("/admin", adminListComplaints);
router.patch("/admin/:id", adminUpdateComplaint);

export default router;
