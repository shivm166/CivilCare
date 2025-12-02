import express from "express";
import { maintenanceBill } from "../../models/Maintenance/maintenance_bill.model.js";
import { MaintenanceRule } from "../../models/Maintenance/maintenance_rule.model.js";

import { STATUS_CODES } from "../../utils/status.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/response.js";

import { maintenancePayment } from "../../models/Maintenance/maintenance_payment.model.js";

const { SUCCESS, CREATED, BAD_REQUEST, CONFLICT, NOT_FOUND, SERVER_ERROR } =
  STATUS_CODES;

// ✅ Create New Rule
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
    const societyId = req.society._id; // Comes from middleware

    // Check for duplicate rule
    const existingRule = await MaintenanceRule.findOne({
      society: societyId,
      bhkType,
    });
    if (existingRule) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        `A rule for ${bhkType} already exists.`
      );
    }

    const newRule = await MaintenanceRule.create({
      society: societyId,
      bhkType,
      amount,
      dueDay,
      gracePeriod,
      penaltyType,
      penaltyValue,
      active,
      createdBy: req.user._id,
    });

    return sendSuccessResponse(
      res,
      CREATED,
      newRule,
      "Maintenance rule created successfully"
    );
  } catch (error) {
    console.error("Create Rule Error:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to create rule");
  }
};

// ✅ Get All Rules
export const getMaintanenceRules = async (req, res) => {
  try {
    const rules = await MaintenanceRule.find({ society: req.society._id }).sort(
      { amount: 1 }
    );
    return sendSuccessResponse(
      res,
      SUCCESS,
      rules,
      "Maintenance rules fetched"
    );
  } catch (error) {
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to fetch rules");
  }
};

// ✅ Update Rule
export const updateMaintenanceRule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRule = await MaintenanceRule.findOneAndUpdate(
      { _id: id, society: req.society._id }, // Ensure security: can only update own society's rule
      req.body,
      { new: true }
    );

    if (!updatedRule)
      return sendErrorResponse(res, NOT_FOUND, null, "Rule not found");

    return sendSuccessResponse(
      res,
      SUCCESS,
      updatedRule,
      "Rule updated successfully"
    );
  } catch (error) {
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to update rule");
  }
};

// ✅ Delete Rule
export const deleteMaintenanceRule = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MaintenanceRule.findOneAndDelete({
      _id: id,
      society: req.society._id,
    });

    if (!deleted)
      return sendErrorResponse(res, NOT_FOUND, null, "Rule not found");

    return sendSuccessResponse(res, SUCCESS, null, "Rule deleted successfully");
  } catch (error) {
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to delete rule");
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

//maintenance payment controllers
export const recordMaintenancePayment = async (req, res) => {
  try {
    const { billId, amount, method, transactionId, paidAt } = req.body;
    const newPayment = await maintenancePayment.create({
      bill: billId,
      paidBy: req.user._id,
      amount,
      method,
      transactionId,
      paidAt,
    });
    return sendSuccessResponse(
      res,
      CREATED,
      { newPayment },
      "Maintenance payment recorded successfully"
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

//maintenance bill modal  controller
export const generateMaintenanceBill = async (req, res) => {
  try {
    const { unitId, ruleId, billingMonth, dueDate } = req.body;
    const newBill = await maintenanceBill.create({
      unit: unitId,
      rule: ruleId,
      billingMonth,
      dueDate,
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

export const getMaintenanceBills = async (req, res) => {
  try {
    const bills = await maintenanceBill
      .find({})
      .populate("unit")
      .populate("rule");
    return sendSuccessResponse(
      res,
      SUCCESS,
      { bills },
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
    const bill = await maintenanceBill
      .findById(id)
      .populate("unit")
      .populate("rule");
    if (!bill) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Maintenance bill not found"
      );
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
