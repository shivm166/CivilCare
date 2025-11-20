import { Router } from "express";
import { getAllUsers } from "../../../../controllers/superadmin/users.controllers.js";

const router = Router()

router.route("/").get(getAllUsers)

export default router