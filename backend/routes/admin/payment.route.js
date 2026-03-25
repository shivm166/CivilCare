import { Router } from "express";
import {
  getMyBills,
  getCurrentBill,
  processPayment,
  getMyPaymentHistory,
  getUserFundSummary,
} from "../../controllers/user/payment.controllers.js";
import { validateRequest } from "../../validatores/validateMiddleware.js";
import { validatePayment } from "../../validatores/validation.payment.js";
import protectRoute from "../../middleware/isProtected.js";
import attachSocietyContext from "../../middleware/attachSocietyContext.js";

const router = Router();

// Apply middlewares
router.use(protectRoute);
router.use(attachSocietyContext);

// ==================== BILL ROUTES ====================
router.get("/my-bills", getMyBills);
router.get("/current-bill", getCurrentBill);

// ==================== PAYMENT ROUTES ====================
router.post("/pay", validateRequest(validatePayment), processPayment);
router.get("/payment-history", getMyPaymentHistory);

// ==================== FUND ROUTES (Read-only for users) ====================
router.get("/funds", getUserFundSummary);

export default router;
