import { Router } from "express";
import buildingRoutes from "./building/building.route.js";
import unitRoutes from "./unit/unit.route.js";
import attachSocietyContext from "../../../middleware/attachSocietyContext.js";
import { checkAdmin } from "../../../middleware/checkAdmin.js";

const router = Router();

router.use(attachSocietyContext);
router.use(checkAdmin);

router.use("/building", buildingRoutes);

router.use("/unit", unitRoutes);

export default router;
