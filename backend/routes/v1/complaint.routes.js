import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaints,
  updateComplaintStatus,
  getTotalComplaints,
} from "../../controllers/user/complaint.controllers.js";
import protectRoute, { requireAdmin } from "../../middleware/isProtected.js";
import attachSocietyContext from "../../middleware/attachSocietyContext.js";

const router = express.Router();

router.use(protectRoute);
router.use(attachSocietyContext);
//user routes
router.post("/createComplaint", createComplaint);
router.get("/getMyComplaints", getComplaints);

// Admin Routes
router.get("/getAllComplaints", requireAdmin, getAllComplaints);
router.patch(
  "/updateComplaint/:id/status",
  requireAdmin,
  updateComplaintStatus
);

// Global Stats Route
router.get("/complaints", getTotalComplaints);

export default router;
