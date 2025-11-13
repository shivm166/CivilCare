import express from "express";
import {
  getTotalUsers,
  getTotalComplaints,
} from "../controllers/adminStats.controllers.js";

const router = express.Router();

router.get("/users", getTotalUsers);
router.get("/complaints", getTotalComplaints);

export default router;
