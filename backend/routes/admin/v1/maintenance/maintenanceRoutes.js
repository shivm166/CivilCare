import express from "express";
import { postMaintanenceRule } from "../../../../controllers/maintenance/maintenance.js";

const router = express.Router();

router.route("/").post(postMaintanenceRule);

export default router;
