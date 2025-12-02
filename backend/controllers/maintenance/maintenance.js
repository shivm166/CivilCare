import { maintenanceBill } from "../../models/Maintenance/maintenance_bill.model.js";
import { Unit } from "../../models/unit.model.js";
import { STATUS_CODES } from "../../utils/status.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/response.js";
import { maintenancePayment } from "../../models/Maintenance/maintenance_payment.model.js";
import { MaintenanceRule } from "../../models/Maintenance/maintenance_rule.model.js";

const {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = STATUS_CODES;

const calculateLateFee = (bill, rule) => {
  if (bill.status === "paid") return bill.lateFeeApplied;

  const gracePeriodEnd = new Date(bill.dueDate);
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + rule.gracePeriod);
  gracePeriodEnd.setHours(23, 59, 59, 999);

  const currentDate = new Date();
  if (currentDate <= gracePeriodEnd) return 0;

  let lateFee = 0;

  const dayAfterGrace = new Date(gracePeriodEnd);
  dayAfterGrace.setDate(dayAfterGrace.getDate() + 1);
  dayAfterGrace.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - dayAfterGrace.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    if (rule.penaltyType === "fixed_amount") {
      lateFee = rule.penaltyValue;
    } else if (rule.penaltyType === "percentage_of_maintenance") {
      lateFee = bill.amount * (rule.penaltyValue / 100);
    } else if (rule.penaltyType === "daily_rate") {
      lateFee = diffDays * rule.penaltyValue;
    }
  }

  return Math.max(0, lateFee);
};

const updateBillLateFeeAndStatus = async (bill) => {
  if (bill.status === "paid" || !bill.rule) return bill;

  const rule = bill.rule;

  const calculatedLateFee = calculateLateFee(bill, rule);
  const newTotalAmount = bill.amount + calculatedLateFee;

  let newStatus = bill.status;
  const gracePeriodEnd = new Date(bill.dueDate);
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + rule.gracePeriod);

  if (new Date() > gracePeriodEnd && bill.status === "pending") {
    newStatus = "overdue";
  }

  if (calculatedLateFee !== bill.lateFeeApplied || newStatus !== bill.status) {
    bill.lateFeeApplied = calculatedLateFee;
    bill.totalAmount = newTotalAmount;
    bill.status = newStatus;
    await bill.save();
  }

  return bill;
};

// ADMIN
export const postMaintanenceRule = async (req, res) => {
  try {
    const {
      bhkType,
      amount,
      dueDay,
      gracePeriod,
      penaltyType,
      penaltyValue,
      active,
    } = req.body;

    const newMaintenanceRule = await MaintenanceRule.create({
      bhkType,
      society: req.society._id,
      dueDay,
      gracePeriod,
      penaltyType,
      penaltyValue,
      amount,
      active,
      createdBy: req.user._id,
    });

    return sendSuccessResponse(
      res,
      CREATED,
      { newMaintenanceRule },
      "Maintenance rule created successfully"
    );
  } catch (error) {
    console.log("Error creating maintenance rule:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const getMaintanenceRules = async (req, res) => {
  try {
    const maintenanceRules = await MaintenanceRule.find({
      society: req.society._id,
    });
    return sendSuccessResponse(
      res,
      SUCCESS,
      { maintenanceRules },
      "Maintenance rules fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching maintenance rules:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const updateMaintenanceRule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bhkType,
      amount,
      dueDay,
      gracePeriod,
      penaltyType,
      penaltyValue,
      active,
    } = req.body;

    const updatedRule = await MaintenanceRule.findByIdAndUpdate(
      id,
      {
        bhkType,
        amount,
        dueDay,
        gracePeriod,
        penaltyType,
        penaltyValue,
        active,
      },
      { new: true }
    );

    return sendSuccessResponse(
      res,
      SUCCESS,
      { updatedRule },
      "Maintenance rule updated successfully"
    );
  } catch (error) {
    console.log("Error updating maintenance rule:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const deleteMaintenanceRule = async (req, res) => {
  try {
    const { id } = req.params;
    await MaintenanceRule.findByIdAndDelete(id);

    return sendSuccessResponse(
      res,
      SUCCESS,
      null,
      "Maintenance rule deleted successfully"
    );
  } catch (error) {
    console.log("Error deleting maintenance rule:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const getMaintenanceRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await MaintenanceRule.findById(id);

    if (!rule) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Maintenance rule not found"
      );
    }

    return sendSuccessResponse(
      res,
      SUCCESS,
      { rule },
      "Maintenance rule fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching maintenance rule by ID:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// USER
export const recordMaintenancePayment = async (req, res) => {
  try {
    const { billId, amount, method, transactionId, paidAt } = req.body;
    const userId = req.user._id;

    let bill = await maintenanceBill.findById(billId).populate("rule");

    if (!bill) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Maintenance bill not found"
      );
    }
    if (bill.status === "paid") {
      return sendErrorResponse(res, CONFLICT, null, "Bill is already paid.");
    }
    if (bill.resident.toString() !== userId.toString()) {
      return sendErrorResponse(res, UNAUTHORIZED, null, "Not authorized.");
    }

    const rule = bill.rule;
    const finalLateFee = calculateLateFee(bill, rule);
    const finalTotalAmountDue = bill.amount + finalLateFee;

    if (amount < finalTotalAmountDue) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Payment amount is less than ${finalTotalAmountDue}.`
      );
    }

    const newPayment = await maintenancePayment.create({
      bill: billId,
      paidBy: userId,
      amount: finalTotalAmountDue,
      method,
      transactionId,
      paidAt: paidAt || new Date(),
    });

    bill.status = "paid";
    bill.paidAt = newPayment.paidAt;
    bill.lateFeeApplied = finalLateFee;
    bill.totalAmount = finalTotalAmountDue;
    bill.paymentRef = newPayment._id;
    await bill.save();

    return sendSuccessResponse(
      res,
      CREATED,
      { newPayment, updatedBill: bill },
      "Maintenance payment recorded successfully"
    );
  } catch (error) {
    console.log("Error recording maintenance payment:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const getMaintenanceRecord = async (req, res) => {
  try {
    const { billId } = req.params;
    const payments = await maintenancePayment
      .find({ bill: billId })
      .populate("paidBy", "name email");

    return sendSuccessResponse(
      res,
      SUCCESS,
      { payments },
      "Maintenance payments fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching maintenance record:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const getAllMaintenancePayments = async (req, res) => {
  try {
    const payments = await maintenancePayment
      .find({})
      .populate("bill")
      .populate("paidBy", "name email");

    return sendSuccessResponse(
      res,
      SUCCESS,
      { payments },
      "All maintenance payments fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching all maintenance payments:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const getMaintenancePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await maintenancePayment
      .findById(id)
      .populate("bill")
      .populate("paidBy", "name email");

    if (!payment) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Maintenance payment not found"
      );
    }

    return sendSuccessResponse(
      res,
      SUCCESS,
      { payment },
      "Maintenance payment fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching maintenance payment by ID:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const deleteMaintenancePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await maintenancePayment.findByIdAndDelete(id);

    return sendSuccessResponse(
      res,
      SUCCESS,
      null,
      "Maintenance payment deleted successfully"
    );
  } catch (error) {
    console.log("Error deleting maintenance payment:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const generateMaintenanceBill = async (req, res) => {
  try {
    const { unitId, ruleId, forMonth } = req.body;

    const rule = await MaintenanceRule.findById(ruleId);
    if (!rule || rule.society.toString() !== req.society._id.toString()) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Maintenance rule not found"
      );
    }

    const unit = await Unit.findById(unitId).populate("resident");
    if (!unit || unit.society.toString() !== req.society._id.toString()) {
      return sendErrorResponse(res, NOT_FOUND, null, "Unit not found");
    }

    if (!unit.resident || !unit.resident._id) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Unit has no resident");
    }

    if (unit.bhkType !== rule.bhkType) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        `Rule for ${rule.bhkType} cannot apply to ${unit.bhkType}`
      );
    }

    const [year, month] = forMonth.split("-").map(Number);
    const dueDate = new Date(year, month - 1, rule.dueDay);
    dueDate.setHours(23, 59, 59, 999);

    const existingBill = await maintenanceBill.findOne({
      unit: unitId,
      forMonth,
    });

    if (existingBill) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        `Bill already generated for ${forMonth}`
      );
    }

    const newBill = await maintenanceBill.create({
      society: req.society._id,
      unit: unitId,
      resident: unit.resident._id,
      rule: ruleId,
      amount: rule.amount,
      dueDate,
      forMonth,
      totalAmount: rule.amount,
    });

    return sendSuccessResponse(
      res,
      CREATED,
      { newBill },
      "Maintenance bill generated successfully"
    );
  } catch (error) {
    console.log("Error generating maintenance bill:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const getMaintenanceBills = async (req, res) => {
  try {
    let bills = await maintenanceBill
      .find({ society: req.society._id })
      .populate("unit", "building unitNumber bhkType")
      .populate("resident", "name email")
      .populate("rule");

    const updatedBills = await Promise.all(
      bills.map(async (bill) => {
        if (bill.status !== "paid") {
          return await updateBillLateFeeAndStatus(bill);
        }
        return bill;
      })
    );

    return sendSuccessResponse(
      res,
      SUCCESS,
      { bills: updatedBills },
      "Maintenance bills fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching maintenance bills:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const getMaintenanceBillById = async (req, res) => {
  try {
    const { id } = req.params;

    let bill = await maintenanceBill
      .findById(id)
      .populate("unit")
      .populate("rule");

    if (!bill || bill.society.toString() !== req.society._id.toString()) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Maintenance bill not found"
      );
    }

    if (bill.status !== "paid") {
      bill = await updateBillLateFeeAndStatus(bill);
    }

    return sendSuccessResponse(
      res,
      SUCCESS,
      { bill },
      "Maintenance bill fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching maintenance bill by ID:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const deleteMaintenanceBill = async (req, res) => {
  try {
    const { id } = req.params;
    await maintenanceBill.findByIdAndDelete(id);

    return sendSuccessResponse(
      res,
      SUCCESS,
      null,
      "Maintenance bill deleted successfully"
    );
  } catch (error) {
    console.log("Error deleting maintenance bill:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// USER
export const getUserMaintenanceBills = async (req, res) => {
  try {
    const userId = req.user._id;

    let bills = await maintenanceBill
      .find({ resident: userId, society: req.society._id })
      .populate("unit", "building unitNumber bhkType")
      .populate("rule");

    const updatedBills = await Promise.all(
      bills.map(async (bill) => {
        if (bill.status !== "paid")
          return await updateBillLateFeeAndStatus(bill);
        return bill;
      })
    );

    return sendSuccessResponse(
      res,
      SUCCESS,
      { bills: updatedBills },
      "User maintenance bills fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching user maintenance bills:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ADMIN
export const getUnitsBySocietyForAdmin = async (req, res) => {
  try {
    const units = await Unit.find({ society: req.society._id }).populate(
      "resident",
      "name email"
    );

    return sendSuccessResponse(
      res,
      SUCCESS,
      { units },
      "Units fetched successfully"
    );
  } catch (error) {
    console.log("Error fetching units by society for admin:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};
