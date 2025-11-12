// routes/complaints.js
import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complaint.controllers.js";
import protectRoute from "../middlelware/isProtected.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

router.post("/createComplaint", createComplaint);
router.get("/getMyComplaints", getComplaints);

// routes/complaints.js
router.get("/getAllComplaints", getAllComplaints);
router.patch("/updateComplaint/:id/status", updateComplaintStatus);

export default router;
