import { Router } from "express";
import {
  sendMemberInvitation,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
  getSentInvitations,
} from "../../controllers/admin/invitation.controllers.js";
import protectRoute from "../../middleware/isProtected.js";

const router = Router();

// User routes
router.get("/my-invitations", protectRoute, getMyInvitations);
router.post("/:invitationId/accept", protectRoute, acceptInvitation);
router.post("/:invitationId/reject", protectRoute, rejectInvitation);

// Admin routes
router.post("/society/:societyId/send", protectRoute, sendMemberInvitation);
router.get("/society/:societyId/sent", protectRoute, getSentInvitations);

export default router;
