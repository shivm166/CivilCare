import { Router } from "express";
import superAdminRoutes from "./superadmin/index.js";
import adminRoutes from "./admin/index.js"; // ✅ NEW

const router = Router();

// Super Admin Routes
router.use("/superadmin", superAdminRoutes);

// Admin Routes (membership, invitations, etc.)
router.use("/", adminRoutes); // ✅ NEW

export default router;
