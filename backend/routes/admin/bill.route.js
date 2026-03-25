import { Router } from "express";
import {
  generateMonthlyBills,
  getAllBills,
  getBillById,
  getFundSummary,
  getAllTransactions,
  withdrawFunds,
  getMemberPaymentStatus,
} from "../../controllers/admin/bill.controllers.js";
import { validateRequest } from "../../validatores/validateMiddleware.js";
import {
  validateBillGeneration,
  validateWithdrawal,
} from "../../validatores/validation.payment.js";
import protectRoute, { requireAdmin } from "../../middleware/isProtected.js";
import attachSocietyContext from "../../middleware/attachSocietyContext.js";

const router = Router();

// Apply middlewares
router.use(protectRoute);
router.use(attachSocietyContext);
router.use(requireAdmin);

// ==================== BILL ROUTES ====================
router.post(
  "/generate",
  validateRequest(validateBillGeneration),
  generateMonthlyBills
);
router.get("/", getAllBills);
router.get("/:billId", getBillById);
router.get("/members/status", getMemberPaymentStatus);

// ==================== FUND ROUTES ====================
router.get("/funds/summary", getFundSummary);
router.get("/funds/transactions", getAllTransactions);
router.post(
  "/funds/withdraw",
  validateRequest(validateWithdrawal),
  withdrawFunds
);

export default router;
