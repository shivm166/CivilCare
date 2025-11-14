import express from "express";
import {
  createAnnouncement,
  getAllAnnouncementsAdmin,
  updateAnnouncement,
  deleteAnnouncement,
  replyToComment,
  getAllAnnouncementsUser,
  addComment,
} from "../../controllers/announcement.controllers.js";
import protectRoute, { requireAdmin } from "../../middlelware/isProtected.js";
import attachSocietyContext from "../../middlelware/attachSocietyContext.js";

const router = express.Router();

// Apply middleware for ALL announcement routes
router.use(protectRoute);
router.use(attachSocietyContext);

// ==================== ADMIN ROUTES ====================
router.post("/admin/create", requireAdmin, createAnnouncement);
router.get("/admin/all", requireAdmin, getAllAnnouncementsAdmin);
router.patch("/admin/update/:id", requireAdmin, updateAnnouncement);
router.delete("/admin/delete/:id", requireAdmin, deleteAnnouncement);
router.post(
  "/admin/reply/:announcementId/:commentId",
  requireAdmin,
  replyToComment
);

// ==================== USER/MEMBER ROUTES ====================
router.get("/user/all", getAllAnnouncementsUser);
router.post("/user/comment/:id", addComment);

export default router;
