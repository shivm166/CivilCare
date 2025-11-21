import { Router } from "express";
import societyRoutes from "./society/society.route.js"

const router = Router()

router.use("/society", societyRoutes)

export default router