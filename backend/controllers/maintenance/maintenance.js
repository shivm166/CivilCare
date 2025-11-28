import express from "express";
import { MaintenanceRule } from "../../models/Maintenance/maintenance_rule.model.js";
import { STATUS_CODES } from "../../utils/status.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/response.js";

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

// export const getMaintanenceRules = async (req, res) => {
//   try {
//     const maintenanceRules = await MaintenanceRule.find({
//       society: req.society._id,
//     });
//     return sendSuccessResponse(
//       res,
//       SUCCESS,
//       { maintenanceRules },
//       "Maintenance rules fetched successfully"
//     );
//   } catch (error) {
//     console.error("Error fetching maintenance rules :", error);
//     return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
//   }
// };
