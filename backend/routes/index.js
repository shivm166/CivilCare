import { Router } from "express";
import superAdminRoutes from "./superadmin/index.js";
import adminRoutes from "./admin/index.js"; // ✅ NEW
import v1Routes from "./admin/v1/index.js"

const router = Router();

// Super Admin Routes
router.use("/superadmin", superAdminRoutes);

// Admin Routes (membership, invitations, etc.)
router.use("/", adminRoutes); // ✅ NEW
router.use("/admin/v1", v1Routes)

export default router;