import express from "express";
import { maintenanceBill } from "../../models/Maintenance/maintenance_bill.model.js";
import { MaintenanceRule } from '../../models/Maintenance/maintenance_rule.model.js';
import { Unit } from "../../models/unit.model.js";

import { STATUS_CODES } from "../../utils/status.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/response.js";

import { maintenancePayment } from "../../models/Maintenance/maintenance_payment.model.js";

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

  if (currentDate <= gracePeriodEnd) {
    return 0;
  }

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
    console.error("Error creating maintenance rule :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error fetching maintenance rules :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error updating maintenance rule :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error deleting maintenance rule :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error fetching maintenance rule by ID :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

export const recordMaintenancePayment = async (req, res) => {
  try {
    const { billId, amount, method, transactionId, paidAt } = req.body; // paidAt is optional
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
      return sendErrorResponse(
        res,
        UNAUTHORIZED,
        null,
        "You are not authorized to pay this bill."
      );
    }

    const rule = bill.rule;

    const finalLateFee = calculateLateFee(bill, rule);
    const finalTotalAmountDue = bill.amount + finalLateFee;

    if (amount < finalTotalAmountDue) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Payment amount is less than the total due amount of ${finalTotalAmountDue}.`
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
      "Maintenance payment recorded successfully and bill marked as paid."
    );
  } catch (error) {
    console.error("Error recording maintenance payment :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error fetching maintenance payments :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error fetching all maintenance payments :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error fetching maintenance payment by ID :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error deleting maintenance payment :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

export const generateMaintenanceBill = async (req, res) => {
  try {
    const { unitId, ruleId, forMonth } = req.body;

    const rule = await MaintenanceRule.findById(ruleId);
    if (!rule || rule.society.toString() !== req.society._id.toString()) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Maintenance rule not found or not in this society."
      );
    }

    const unit = await Unit.findById(unitId).populate("resident");
    if (!unit || unit.society.toString() !== req.society._id.toString()) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Unit not found or not in this society."
      );
    }

    // Enforce required resident
    if (!unit.resident || !unit.resident._id) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Unit must have an assigned resident to generate a bill."
      );
    }
    if (unit.bhkType !== rule.bhkType) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        `Maintenance rule for ${rule.bhkType} cannot be applied to unit with ${unit.bhkType} configuration.`
      );
    }

    const [year, month] = forMonth.split("-").map(Number);
    const dueDate = new Date(year, month - 1, rule.dueDay);
    dueDate.setHours(23, 59, 59, 999);

    const existingBill = await maintenanceBill.findOne({
      unit: unitId,
      forMonth: forMonth,
    });

    if (existingBill) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        `Maintenance bill already generated for unit ${unit.unitNumber} (${unit.bhkType}) for month ${forMonth}.`
      );
    }

    const newBill = await maintenanceBill.create({
      society: req.society._id,
      unit: unitId,
      resident: unit.resident._id,
      rule: ruleId,
      amount: rule.amount,
      dueDate: dueDate,
      forMonth: forMonth,
      totalAmount: rule.amount,
    });

    return sendSuccessResponse(
      res,
      CREATED,
      { newBill },
      "Maintenance bill generated successfully"
    );
  } catch (error) {
    console.error("Error generating maintenance bill :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// Admin fetches all bills
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
    console.error("Error fetching maintenance bills :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error fetching maintenance bill by ID :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

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
    console.error("Error deleting maintenance bill :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

export const getUserMaintenanceBills = async (req, res) => {
  try {
    const userId = req.user._id;

    let bills = await maintenanceBill
      .find({ resident: userId, society: req.society._id })
      .populate("unit", "building unitNumber bhkType")
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
      "Your maintenance bills fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching user's maintenance bills :", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

export const getUnitsBySocietyForAdmin = async (req, res) => {
    try {
        // req.society._id નો ઉપયોગ કરીને વર્તમાન સોસાયટીના તમામ યુનિટ્સ ફિલ્ટર કરો
        const units = await Unit.find({ society: req.society._id })
            .populate("resident", "name email"); // ફ્રન્ટએન્ડ માટે રહેવાસીનું નામ અને ઇમેઇલ પોપ્યુલેટ કરો
            
        return sendSuccessResponse(res, STATUS_CODES.SUCCESS, { units }, "Units fetched successfully");
    } catch (error) {
        console.error("Error fetching units by society for admin:", error);
        return sendErrorResponse(res, STATUS_CODES.SERVER_ERROR, error, "Internal server error");
    }
};
// export {
//   getMaintenanceRuleById,
//   generateMaintenanceBill,
//   getMaintenanceBills,
//   getMaintenanceBillById,
//   deleteMaintenanceBill,
//   getUserMaintenanceBills,
// };
