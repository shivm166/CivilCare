import { Router } from "express";
import {
  searchSocietyByCode, // ⬅️ CHANGED from searchSocietyById
  sendJoinRequest,
  getMyRequests,
  getAllRequestsForSociety,
  acceptRequest,
  rejectRequest,
} from "../../controllers/admin/request.controllers.js";
import { validateSendRequest } from "../../validatores/validation.request.js";
import { validateRequest } from "../../validatores/validateMiddleware.js";
import protectRoute from "../../middleware/isProtected.js";

const router = Router();

// ==================== PUBLIC ROUTES (Protected by Auth) ====================

// Search society by JoiningCode (for users to find societies to join)
router.get("/society/search/:code", protectRoute, searchSocietyByCode); // ⬅️ CHANGED

// Send join request to a society
router.post(
  "/send",
  protectRoute,
  validateRequest(validateSendRequest),
  sendJoinRequest
);

// Get all requests sent by logged-in user
router.get("/my-requests", protectRoute, getMyRequests);

// ==================== ADMIN ROUTES ====================

// Get all pending requests for a specific society (admin only)
router.get(
  "/society/:societyId/requests",
  protectRoute,
  getAllRequestsForSociety
);

// Accept a join request (admin only)
router.patch("/:requestId/accept", protectRoute, acceptRequest);

// Reject a join request (admin only)
router.patch("/:requestId/reject", protectRoute, rejectRequest);

export default router;

// API Endpoints Created

// User Endpoints:

// GET    /api/request/society/:id              - Search society by ID
// POST   /api/request/send                     - Send join request
// GET    /api/request/my-requests              - Get my requests

// Admin Endpoints:

// GET    /api/request/society/:societyId/requests  - Get all requests for society
// PATCH  /api/request/:requestId/accept            - Accept request
// PATCH  /api/request/:requestId/reject            - Reject request
