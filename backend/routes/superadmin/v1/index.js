import { Router } from "express";
import societyRoutes from "./society/society.route.js";
import userRoutes from "./user/user.routes.js";
import statsRoutes from "./stats/stats.route.js";
import protectRoute from "../../../middleware/isProtected.js";
import { checkSuperAdmin } from "../../../middleware/checkSuperAdmin.js";

const router = Router();

router.use(protectRoute);
router.use(checkSuperAdmin);

router.use("/society", societyRoutes);
router.use("/user", userRoutes);
router.use("/stats", statsRoutes);

export default router;
