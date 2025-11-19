import { Router } from "express";
import {
  searchUserByEmail, // ✅ UPDATED
  addExistingMember,
  inviteNewMember,
  getSocietyMembers,
  removeMember,
  updateMemberRole,
} from "../../controllers/member.controllers.js";
import protectRoute from "../../middleware/isProtected.js";

const router = Router();

// 🔍 Search user by exact email
router.get("/search-by-email", protectRoute, searchUserByEmail); // ✅ UPDATED

// 📋 Get all members of a society
router.get("/:societyId/members", protectRoute, getSocietyMembers);

// ✅ Add existing user to society
router.post("/:societyId/members/add", protectRoute, addExistingMember);

// 📧 Invite new user to society
router.post("/:societyId/members/invite", protectRoute, inviteNewMember);

// 🗑️ Remove member from society
router.delete("/:societyId/members/:memberId", protectRoute, removeMember);

// 📝 Update member role
router.patch(
  "/:societyId/members/:memberId/role",
  protectRoute,
  updateMemberRole
);

export default router;
