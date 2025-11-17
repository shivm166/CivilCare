import express from "express";
import {
  getSocietyWiseUserCount,
  getSocietyDetails,
} from "../controllers/admin.controllers.js";
import { authenticateToken } from "../middlelware/auth.middleware.js";
// import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/society-stats", authenticateToken, getSocietyWiseUserCount);
router.get("/society/:societyId", authenticateToken, getSocietyDetails);

export default router;
