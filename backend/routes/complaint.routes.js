// routes/complaints.js
import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complaint.controllers.js";
import protectRoute, { requireAdmin } from "../middlelware/isProtected.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

router.post("/createComplaint", createComplaint);
router.get("/getMyComplaints", getComplaints);

// routes/complaints.js
router.get("/getAllComplaints", protectRoute, requireAdmin, getAllComplaints);
router.patch(
  "/updateComplaint/:id/status",
  protectRoute,
  requireAdmin,
  updateComplaintStatus
);

export default router;
