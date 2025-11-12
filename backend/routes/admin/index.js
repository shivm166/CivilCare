import { Router } from "express";
import activationRoute from "./activation.route.js";
import invitationRoute from "./invitation.route.js";
import memberRoute from "./member.route.js";
import requestRoute from "./request.route.js";

const router = Router();

// Mount all admin routes
router.use("/activation", activationRoute);
router.use("/invitation", invitationRoute);
router.use("/member", memberRoute);
router.use("/request", requestRoute);

export default router;
