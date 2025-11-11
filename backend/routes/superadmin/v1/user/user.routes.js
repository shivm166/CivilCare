import { Router } from "express";
import { getAllUsers } from "../../../../controllers/superadmin.controllers.js";

const router = Router()

router.route("/").get(getAllUsers)

export default router