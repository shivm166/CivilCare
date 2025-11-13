import express from "express";
import {
  getTotalUsers,
} from "../controllers/adminStats.controllers.js";

const router = express.Router();

router.get("/users", getTotalUsers);

export default router;
