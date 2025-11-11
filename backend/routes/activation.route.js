import { Router } from "express";
import {
  activateAccount,
  verifyInvitationToken,
  resendInvitation,
} from "../controllers/activation.controllers.js";

const router = Router();

// 🔓 Activate invited user account
router.post("/activate", activateAccount);

// 🔍 Verify invitation token
router.get("/verify/:token", verifyInvitationToken);

// 📧 Resend invitation
router.post("/resend", resendInvitation);

export default router;
