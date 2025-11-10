import { Router } from "express";
import {
  adminListComplaints,
  adminUpdateComplaint,
  createComplaint,
  get_complaints,
} from "../controllers/complaint.controllers.js";
import protectRoute from "../middlelware/isProtected.js";

const router = Router();

router.use(protectRoute);
// USER
router.post("/post_complaint", createComplaint);
router.get("/my_complaints", get_complaints);

// ADMIN
router.get("/admin_com_list", adminListComplaints);
router.patch("/admin_com/:id", adminUpdateComplaint);

export default router;
