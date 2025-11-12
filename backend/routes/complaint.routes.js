import { Router } from "express";
import {
  adminListComplaints,
  adminUpdateComplaint,
  createComplaint,
  get_complaints,
} from "../controllers/complaint.controllers.js";
import protectRoute from "../middlelware/isProtected.js";

const router = Router();

// All routes below are protected by JWT authentication
router.use(protectRoute);

// USER ROUTES (for residents)
// POST: /api/complaints/post_complaint - To raise a new complaint
router.post("/post_complaint", createComplaint);
// GET: /api/complaints/my_complaints - To get complaints raised by the logged-in user
router.get("/my_complaints", get_complaints);

// ADMIN ROUTES (for society admins)
// GET: /api/complaints/admin_com_list - To get the list of all complaints (with filters)
router.get("/admin_com_list", adminListComplaints);
// PATCH: /api/complaints/admin_com/:id - To update the status or priority of a complaint
router.patch("/admin_com/:id", adminUpdateComplaint);

export default router;
