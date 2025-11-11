import { Router } from "express";
import superAdminRoutes from "./superadmin/index.js"
const router = Router()

router.use("/superadmin", superAdminRoutes)

export default router