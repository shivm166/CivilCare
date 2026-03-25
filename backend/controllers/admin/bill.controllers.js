import { MaintenanceBill } from "../../models/maintenance_bill.model.js";
import { Payment } from "../../models/payment.model.js";
import { SocietyFund } from "../../models/society_fund.model.js";
import { FundTransaction } from "../../models/fund_transaction.model.js";
import { MaintenanceRule } from "../../models/maintenance_rule.model.js";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";
import { generateBillsForSociety, updateOverdueBillsPenalty } from "../../utils/billGenerator.js";
import { isValidObjectId } from "mongoose";

const {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = STATUS_CODES;

// ==================== BILL GENERATION ====================

/**
 * Generate monthly maintenance bills for all members
 */
export const generateMonthlyBills = async (req, res) => {
  try {
    const societyId = req.society?._id;
    const { month, year } = req.body;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Society context is required"
      );
    }

    if (!month || !year) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Month and year are required"
      );
    }

    // Validate month and year
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Invalid month. Must be between 1 and 12"
      );
    }

    if (yearNum < 2020 || yearNum > 2100) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid year");
    }

    // Generate bills
    const result = await generateBillsForSociety(societyId, monthNum, yearNum);

    return sendSuccessResponse(
      res,
      CREATED,
      result,
      `Successfully generated ${result.billsGenerated} bills for ${monthNum}/${yearNum}`
    );
  } catch (error) {
    console.error("Error in generateMonthlyBills:", error);
    return sendErrorResponse(
      res,
      error.message.includes("already generated") ? BAD_REQUEST : SERVER_ERROR,
      error,
      error.message || "Failed to generate bills"
    );
  }
};

/**
 * Get all maintenance bills (Admin view)
 */
export const getAllBills = async (req, res) => {
  try {
    const societyId = req.society?._id;
    const { status, month, year, userId } = req.query;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Society context is required"
      );
    }

    const query = { society: societyId };

    if (status) query.status = status;
    if (month) query.billingMonth = parseInt(month);
    if (year) query.billingYear = parseInt(year);
    if (userId && isValidObjectId(userId)) query.user = userId;

    const bills = await MaintenanceBill.find(query)
      .populate("user", "name email phone")
      .populate("unit", "name bhkType")
      .populate("building", "name")
      .populate("maintenanceRule", "ruleName")
      .sort({ createdAt: -1 });

    // Update overdue penalties before sending response
    await updateOverdueBillsPenalty(societyId);

    return sendSuccessResponse(
      res,
      SUCCESS,
      { bills, count: bills.length },
      "Bills fetched successfully"
    );
  } catch (error) {
    console.error("Error in getAllBills:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

/**
 * Get bill by ID
 */
export const getBillById = async (req, res) => {
  try {
    const { billId } = req.params;
    const societyId = req.society?._id;

    if (!isValidObjectId(billId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid bill ID");
    }

    const bill = await MaintenanceBill.findOne({
      _id: billId,
      society: societyId,
    })
      .populate("user", "name email phone")
      .populate("unit", "name bhkType")
      .populate("building", "name")
      .populate("maintenanceRule", "ruleName penaltyType penaltyValue dueDays")
      .populate("maintenancePayment")
      .populate("penaltyPayment");

    if (!bill) {
      return sendErrorResponse(res, NOT_FOUND, null, "Bill not found");
    }

    return sendSuccessResponse(res, SUCCESS, bill, "Bill fetched successfully");
  } catch (error) {
    console.error("Error in getBillById:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

// ==================== FUND MANAGEMENT ====================

/**
 * Get society fund summary
 */
export const getFundSummary = async (req, res) => {
  try {
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Society context is required"
      );
    }

    // Get or create society fund
    let fund = await SocietyFund.findOne({ society: societyId });

    if (!fund) {
      fund = await SocietyFund.create({
        society: societyId,
        createdBy: req.user._id,
      });
    }

    // Get recent transactions
    const recentTransactions = await FundTransaction.find({
      society: societyId,
    })
      .populate("user", "name email")
      .populate("withdrawnBy", "name email")
      .sort({ transactionDate: -1 })
      .limit(50);

    // Get bills summary
    const billsStats = await MaintenanceBill.aggregate([
      { $match: { society: societyId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        fund,
        transactions: recentTransactions,
        billsStats,
      },
      "Fund summary fetched successfully"
    );
  } catch (error) {
    console.error("Error in getFundSummary:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

/**
 * Get all fund transactions
 */
export const getAllTransactions = async (req, res) => {
  try {
    const societyId = req.society?._id;
    const { type, category, startDate, endDate } = req.query;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Society context is required"
      );
    }

    const query = { society: societyId };

    if (type) query.transactionType = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    const transactions = await FundTransaction.find(query)
      .populate("user", "name email")
      .populate("withdrawnBy", "name email")
      .populate("bill", "billingMonth billingYear")
      .sort({ transactionDate: -1 });

    return sendSuccessResponse(
      res,
      SUCCESS,
      { transactions, count: transactions.length },
      "Transactions fetched successfully"
    );
  } catch (error) {
    console.error("Error in getAllTransactions:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

/**
 * Withdraw funds from society account
 */
export const withdrawFunds = async (req, res) => {
  try {
    const societyId = req.society?._id;
    const userId = req.user._id;
    const { amount, reason, notes } = req.body;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Society context is required"
      );
    }

    if (!amount || amount <= 0) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Valid amount is required"
      );
    }

    if (!reason || reason.trim().length < 10) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Withdrawal reason is required (minimum 10 characters)"
      );
    }

    // Get society fund
    const fund = await SocietyFund.findOne({ society: societyId });

    if (!fund) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Society fund not found"
      );
    }

    // Check if sufficient balance
    if (fund.totalBalance < amount) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Insufficient balance. Available: ₹${fund.totalBalance}`
      );
    }

    // Withdraw funds
    fund.withdrawFunds(amount);
    await fund.save();

    // Create transaction record
    const transaction = await FundTransaction.create({
      society: societyId,
      transactionType: "outgoing",
      category: "admin_withdrawal",
      amount,
      description: reason,
      withdrawnBy: userId,
      withdrawalReason: reason,
      balanceAfter: fund.totalBalance,
      notes: notes || "",
      transactionDate: new Date(),
    });

    await transaction.populate("withdrawnBy", "name email");

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        fund,
        transaction,
      },
      `Successfully withdrew ₹${amount} from society fund`
    );
  } catch (error) {
    console.error("Error in withdrawFunds:", error);
    return sendErrorResponse(
      res,
      SERVER_ERROR,
      error,
      error.message || "Failed to withdraw funds"
    );
  }
};

/**
 * Get member-wise payment status
 */
export const getMemberPaymentStatus = async (req, res) => {
  try {
    const societyId = req.society?._id;
    const { month, year } = req.query;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Society context is required"
      );
    }

    const query = { society: societyId };
    
    if (month) query.billingMonth = parseInt(month);
    if (year) query.billingYear = parseInt(year);

    const memberStatus = await MaintenanceBill.find(query)
      .populate("user", "name email phone")
      .populate("unit", "name bhkType")
      .populate("building", "name")
      .sort({ "user.name": 1 });

    return sendSuccessResponse(
      res,
      SUCCESS,
      { members: memberStatus, count: memberStatus.length },
      "Member payment status fetched successfully"
    );
  } catch (error) {
    console.error("Error in getMemberPaymentStatus:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};
