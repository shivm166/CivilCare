import { Router } from "express";
import { getStats } from "../../../../controllers/superadmin/users.controllers.js";

const router = Router()

router.route("/").get(getStats)

export default router