// routes/complaints.js
import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaints,
  updateComplaintStatus,
  getTotalComplaints,
} from "../controllers/complaint.controllers.js";
import protectRoute, { requireAdmin } from "../middleware/isProtected.js";
import attachSocietyContext from "../middleware/attachSocietyContext.js";

const router = express.Router();

router.use(protectRoute);
router.use(attachSocietyContext);

router.post("/createComplaint", createComplaint);
router.get("/getMyComplaints", getComplaints);

router.get("/getAllComplaints", requireAdmin, getAllComplaints);
router.patch(
  "/updateComplaint/:id/status",
  requireAdmin,
  updateComplaintStatus
);
router.get("/complaints", getTotalComplaints);

export default router;
