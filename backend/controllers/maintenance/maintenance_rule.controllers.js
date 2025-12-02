import { MaintenanceRule } from "../../models/Maintenance/maintenance_rule.model.js";
import { STATUS_CODES } from "../../utils/status.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/response.js";

const { SUCCESS, CREATED, SERVER_ERROR, CONFLICT } = STATUS_CODES;

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

    // Duplicate check (Optional but recommended)
    const existingRule = await MaintenanceRule.findOne({
      society: req.society._id,
      bhkType,
    });
    if (existingRule) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        "Rule for this BHK type already exists"
      );
    }

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
    console.error("Error creating maintenance rule:", error);
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
    console.error("Error fetching maintenance rules:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

export const updateMaintenanceRule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRule = await MaintenanceRule.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return sendSuccessResponse(
      res,
      SUCCESS,
      { updatedRule },
      "Maintenance rule updated successfully"
    );
  } catch (error) {
    console.error("Error updating maintenance rule:", error);
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
    console.error("Error deleting maintenance rule:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};
