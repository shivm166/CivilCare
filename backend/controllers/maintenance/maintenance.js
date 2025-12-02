import express from "express";
import { maintenanceBill } from "../../models/Maintenance/maintenance_bill.model.js";

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

//maintenance rule controllers
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
      createdBy,
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
    console.error("Error craeeting maintenance rule :", error);
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
