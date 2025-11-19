import express from "express";
import { getDashboardCounts } from "../controllers/dashboard.controllers.js";

const router = express.Router();

router.get("/counts", getDashboardCounts);

export default router;
