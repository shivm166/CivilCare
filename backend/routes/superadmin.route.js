import { Router } from "express";
import { createSociety, deleteSociety, getMySocieties, updateSociety } from "../controllers/society.controllers.js";
import protectRoute from "../middlelware/isProtected.js";
import { checkSuperUser } from "../middlelware/checkSuperUser.js";
import { getAllUsers, getStats } from "../controllers/superadmin.controllers.js";

const router = Router()

router.route("/society")
                .post(protectRoute, checkSuperUser, createSociety)
                .get(protectRoute, checkSuperUser, getMySocieties)
                .patch(protectRoute, checkSuperUser, updateSociety)
router.route("/society/:id")
                .delete(protectRoute, checkSuperUser, deleteSociety)
router.route("/user")
                .get(protectRoute, checkSuperUser, getAllUsers)
router.route("/stats")
                .get(protectRoute, checkSuperUser, getStats)
                
export default router