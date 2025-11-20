import { Router } from "express";
import activationRoute from "./activation.route.js";
import invitationRoute from "./invitation.route.js";
import memberRoute from "./member.route.js";
import requestRoute from "./request.route.js";
import announcementRoutes from "./announcement.routes.js";
import protectRoute from "../../middleware/isProtected.js";
import v1Routes from "./v1/index.js";

const router = Router();

// ✅ PUBLIC ROUTES - MUST BE BEFORE protectRoute middleware
router.use("/activation", activationRoute); // 🔓 Public access for email activation

router.use(protectRoute);

// Mount all admin routes
router.use("/invitation", invitationRoute);
router.use("/member", memberRoute);
router.use("/request", requestRoute);
router.use("/announcement", announcementRoutes);
router.use("/v1", v1Routes);

export default router;
