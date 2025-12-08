import { Router } from "express";
import superAdminRoutes from "./superadmin/index.js";
import userRoutes from "./user/index.js";
import adminRoutes from "./admin/index.js";
import v1Routes from "./admin/v1/index.js";

const router = Router();

router.use("/superadmin", superAdminRoutes);

router.use("/", adminRoutes);
router.use("/admin/v1", v1Routes);
router.use("/user", userRoutes);

export default router;
