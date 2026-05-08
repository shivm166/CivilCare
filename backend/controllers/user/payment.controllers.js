import { MaintenanceBill } from "../../models/maintenance_bill.model.js";
import { Payment } from "../../models/payment.model.js";
import { SocietyFund } from "../../models/society_fund.model.js";
import { FundTransaction } from "../../models/fund_transaction.model.js";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";

const {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = STATUS_CODES;

// ==================== USER BILLS ====================

/**
 * Get my maintenance bills
 */
export const getMyBills = async (req, res) => {
  try {
    const userId = req.user._id;
    const societyId = req.society?._id;
    const { status, month, year } = req.query;

    if (!societyId) {
      return sendSuccessResponse(res, SUCCESS, {
        bills: [],
        count: 0,
      });
    }

    const query = {
      user: userId,
      society: societyId,
    };

    if (status) query.status = status;
    if (month) query.billingMonth = parseInt(month);
    if (year) query.billingYear = parseInt(year);

    const bills = await MaintenanceBill.find(query)
      .populate("unit", "name bhkType")
      .populate("building", "name")
      .populate("maintenanceRule", "ruleName billingDay dueDays penaltyEnabled penaltyType penaltyValue")
      .populate("maintenancePayment")
      .populate("penaltyPayment")
      .sort({ billingYear: -1, billingMonth: -1 });

    // Calculate current penalty for overdue bills
    for (const bill of bills) {
      if (bill.status !== "paid" && bill.isOverdue && bill.maintenanceRule) {
        const currentPenalty = bill.calculateCurrentPenalty(bill.maintenanceRule);
        if (currentPenalty !== bill.penaltyAmount) {
          bill.penaltyAmount = currentPenalty;
          bill.totalAmount = bill.baseAmount + currentPenalty;
          await bill.save();
        }
      }
    }

    return sendSuccessResponse(
      res,
      SUCCESS,
      { bills, count: bills.length },
      "Bills fetched successfully"
    );
  } catch (error) {
    console.error("Error in getMyBills:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

/**
 * Get current month pending bill
 */
export const getCurrentBill = async (req, res) => {
  try {
    const userId = req.user._id;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendSuccessResponse(res, SUCCESS, { bill: null });
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const bill = await MaintenanceBill.findOne({
      user: userId,
      society: societyId,
      billingMonth: currentMonth,
      billingYear: currentYear,
      status: { $ne: "paid" },
    })
      .populate("unit", "name bhkType")
      .populate("building", "name")
      .populate("maintenanceRule", "ruleName billingDay dueDays penaltyEnabled penaltyType penaltyValue");

    if (bill && bill.isOverdue && bill.maintenanceRule) {
      const currentPenalty = bill.calculateCurrentPenalty(bill.maintenanceRule);
      if (currentPenalty !== bill.penaltyAmount) {
        bill.penaltyAmount = currentPenalty;
        bill.totalAmount = bill.baseAmount + currentPenalty;
        await bill.save();
      }
    }

    return sendSuccessResponse(
      res,
      SUCCESS,
      { bill },
      bill ? "Current bill fetched successfully" : "No pending bill found"
    );
  } catch (error) {
    console.error("Error in getCurrentBill:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

// ==================== PAYMENT PROCESSING ====================

/**
 * Process payment (Dummy payment gateway)
 */
export const processPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const societyId = req.society?._id;
    const {
      billId,
      paymentType,
      amount,
      paymentMethod,
      paymentNote,
      paymentMetadata,
    } = req.body;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Society context is required"
      );
    }

    if (!isValidObjectId(billId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid bill ID");
    }

    if (!["maintenance", "penalty"].includes(paymentType)) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Payment type must be 'maintenance' or 'penalty'"
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

    // Get the bill
    const bill = await MaintenanceBill.findOne({
      _id: billId,
      user: userId,
      society: societyId,
    }).populate("maintenanceRule");

    if (!bill) {
      return sendErrorResponse(res, NOT_FOUND, null, "Bill not found");
    }

    if (bill.status === "paid") {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Bill is already paid"
      );
    }

    // Validate payment type
    if (paymentType === "penalty") {
      if (bill.isPenaltyPaid) {
        return sendErrorResponse(
          res,
          BAD_REQUEST,
          null,
          "Penalty already paid"
        );
      }
      if (bill.penaltyAmount === 0) {
        return sendErrorResponse(
          res,
          BAD_REQUEST,
          null,
          "No penalty applicable for this bill"
        );
      }
      if (amount !== bill.penaltyAmount) {
        return sendErrorResponse(
          res,
          BAD_REQUEST,
          null,
          `Penalty amount must be ₹${bill.penaltyAmount}`
        );
      }
    }

    if (paymentType === "maintenance") {
      if (bill.isMaintenancePaid) {
        return sendErrorResponse(
          res,
          BAD_REQUEST,
          null,
          "Maintenance already paid"
        );
      }
      
      // Check if penalty needs to be paid first
      if (bill.penaltyAmount > 0 && !bill.isPenaltyPaid) {
        return sendErrorResponse(
          res,
          BAD_REQUEST,
          null,
          "Please pay penalty first before paying maintenance"
        );
      }
      
      if (amount !== bill.baseAmount) {
        return sendErrorResponse(
          res,
          BAD_REQUEST,
          null,
          `Maintenance amount must be ₹${bill.baseAmount}`
        );
      }
    }

    // Generate dummy transaction ID
    const transactionId = `TXN${Date.now()}${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // Create payment record
    const payment = await Payment.create({
      society: societyId,
      user: userId,
      bill: billId,
      paymentType,
      amount,
      paymentMethod: paymentMethod || "upi",
      transactionId,
      transactionDate: new Date(),
      status: "success",
      paymentNote: paymentNote || "",
      paymentMetadata: paymentMetadata || {},
    });

    // Update bill
    if (paymentType === "penalty") {
      bill.isPenaltyPaid = true;
      bill.penaltyPayment = payment._id;
    } else if (paymentType === "maintenance") {
      bill.isMaintenancePaid = true;
      bill.maintenancePayment = payment._id;
    }

    bill.updateStatus();
    await bill.save();

    // Update society fund
    let fund = await SocietyFund.findOne({ society: societyId });
    if (!fund) {
      fund = await SocietyFund.create({
        society: societyId,
        createdBy: userId,
      });
    }

    fund.addFunds(amount, paymentType);
    await fund.save();

    // Create fund transaction
    const transaction = await FundTransaction.create({
      society: societyId,
      transactionType: "incoming",
      category: paymentType === "maintenance" ? "maintenance_payment" : "penalty_payment",
      amount,
      description: `${paymentType === "maintenance" ? "Maintenance" : "Penalty"} payment for ${bill.billingMonth}/${bill.billingYear}`,
      user: userId,
      payment: payment._id,
      bill: billId,
      balanceAfter: fund.totalBalance,
      transactionDate: new Date(),
    });

    await payment.populate("bill", "billingMonth billingYear baseAmount penaltyAmount");

    return sendSuccessResponse(
      res,
      CREATED,
      {
        payment,
        bill,
        transaction: {
          transactionId: payment.transactionId,
          amount: payment.amount,
          paymentType: payment.paymentType,
        },
      },
      `Payment of ₹${amount} successful`
    );
  } catch (error) {
    console.error("Error in processPayment:", error);
    return sendErrorResponse(
      res,
      SERVER_ERROR,
      error,
      error.message || "Payment failed"
    );
  }
};

/**
 * Get my payment history
 */
export const getMyPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendSuccessResponse(res, SUCCESS, {
        payments: [],
        count: 0,
      });
    }

    const payments = await Payment.find({
      user: userId,
      society: societyId,
    })
      .populate({
        path: "bill",
        select: "billingMonth billingYear baseAmount penaltyAmount unit building",
        populate: [
          { path: "unit", select: "name bhkType" },
          { path: "building", select: "name" },
        ],
      })
      .sort({ transactionDate: -1 });

    return sendSuccessResponse(
      res,
      SUCCESS,
      { payments, count: payments.length },
      "Payment history fetched successfully"
    );
  } catch (error) {
    console.error("Error in getMyPaymentHistory:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

/**
 * Get fund summary for user (read-only)
 */
export const getUserFundSummary = async (req, res) => {
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

    // Get society fund
    const fund = await SocietyFund.findOne({ society: societyId });

    if (!fund) {
      return sendSuccessResponse(
        res,
        SUCCESS,
        {
          fund: null,
          transactions: [],
        },
        "No fund data available"
      );
    }

    // Get recent transactions (limited view for users)
    const recentTransactions = await FundTransaction.find({
      society: societyId,
    })
      .populate("user", "name")
      .populate("withdrawnBy", "name")
      .select("-notes") // Hide internal notes from users
      .sort({ transactionDate: -1 })
      .limit(20);

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        fund: {
          totalBalance: fund.totalBalance,
          totalMaintenanceCollected: fund.totalMaintenanceCollected,
          totalPenaltyCollected: fund.totalPenaltyCollected,
          totalWithdrawals: fund.totalWithdrawals,
          lastTransactionDate: fund.lastTransactionDate,
        },
        transactions: recentTransactions,
      },
      "Fund summary fetched successfully"
    );
  } catch (error) {
    console.error("Error in getUserFundSummary:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};
