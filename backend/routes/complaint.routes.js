// routes/complaints.js
import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaints,
  updateComplaintStatus,
  getTotalComplaints,
} from "../controllers/complaint.controllers.js";
import protectRoute, { requireAdmin } from "../middlelware/isProtected.js";
import attachSocietyContext from "../middlelware/attachSocietyContext.js"; // ✅ 1. Import it here

const router = express.Router();

// ✅ 2. Apply middleware for ALL complaint routes in the correct order
router.use(protectRoute);
router.use(attachSocietyContext); // ✅ 3. Apply it AFTER protectRoute

// These routes will now have req.user, req.society, and req.role
router.post("/createComplaint", createComplaint);
router.get("/getMyComplaints", getComplaints);

// ✅ 4. requireAdmin will now work correctly
router.get("/getAllComplaints", requireAdmin, getAllComplaints);
router.patch(
  "/updateComplaint/:id/status",
  requireAdmin,
  updateComplaintStatus
);
router.get("/complaints", getTotalComplaints);

export default router;
