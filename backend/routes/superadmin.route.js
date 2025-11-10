import { Router } from "express";
import { createSociety, deleteSociety, getMySocieties, updateSociety } from "../controllers/society.controllers.js";
import protectRoute from "../middlelware/isProtected.js";
import { checkSuperUser } from "../middlelware/checkSuperUser.js";

const router = Router()

router.use("/society")
                .post(protectRoute, checkSuperUser, createSociety)
                .get(protectRoute, checkSuperUser, getMySocieties)
                .patch(protectRoute, checkSuperUser, updateSociety)
                .delete(protectRoute, checkSuperUser, deleteSociety)  
                


export default router