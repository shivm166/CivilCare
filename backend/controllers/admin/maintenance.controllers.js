import { MaintenanceRule } from "../../models/maintenance_rule.model.js";
import { Building } from "../../models/building.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";
import { isValidObjectId } from "mongoose";

const {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = STATUS_CODES;


export const createMaintenanceRule = async (req, res) => {
  try {
    const userId = req.user._id;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "You must be part of an active society to create a maintenance rule."
      );
    }

    const {
      ruleName,
      ruleType,
      building,
      bhkTypes,
      amountType,
      amount,
      bhkWiseAmounts,
      billingDay,
      dueDays,
      penaltyEnabled,
      penaltyType,
      penaltyValue,
      description,
      isActive,
    } = req.body;

    if (ruleType === "general") {
      const existingGeneralRule = await MaintenanceRule.findOne({
        society: societyId,
        ruleType: "general",
      });

      if (existingGeneralRule) {
        return sendErrorResponse(
          res,
          CONFLICT,
          null,
          "A general maintenance rule already exists for this society. Please edit the existing rule or delete it before creating a new one."
        );
      }
    }

    if (ruleType === "building_specific") {
      if (!building || !isValidObjectId(building)) {
        return sendErrorResponse(
          res,
          BAD_REQUEST,
          null,
          "Valid building ID is required for building-specific rules"
        );
      }

      const buildingExists = await Building.findOne({
        _id: building,
        society: societyId,
      });

      if (!buildingExists) {
        return sendErrorResponse(res, NOT_FOUND, null, "Building not found");
      }

      const existingBuildingRule = await MaintenanceRule.findOne({
        society: societyId,
        ruleType: "building_specific",
        building: building,
      });

      if (existingBuildingRule) {
        return sendErrorResponse(
          res,
          CONFLICT,
          null,
          `A maintenance rule already exists for building "${buildingExists.name}". Please edit the existing rule or delete it before creating a new one.`
        );
      }
    }

    const rule = new MaintenanceRule({
      ruleName,
      society: societyId,
      ruleType,
      building: building || null,
      bhkTypes: bhkTypes || [],
      amountType,
      amount: amount || 0,
      bhkWiseAmounts: bhkWiseAmounts || {},
      billingDay,
      dueDays: dueDays || 5,
      penaltyEnabled: penaltyEnabled || false,
      penaltyType: penaltyType || "percentage",
      penaltyValue: penaltyValue || 0,
      description: description || "",
      isActive: isActive !== undefined ? isActive : true,
      createdBy: userId,
    });

    await rule.save();
    await rule.populate("building", "name");
    await rule.populate("createdBy", "name email");

    return sendSuccessResponse(
      res,
      CREATED,
      rule,
      "Maintenance rule created successfully"
    );
  } catch (error) {
    console.error("Error in createMaintenanceRule:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const getAllRules = async (req, res) => {
  try {
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "No active society context found."
      );
    }

    const { ruleType, isActive, buildingId } = req.query;
    const query = { society: societyId };

    if (ruleType) query.ruleType = ruleType;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (buildingId && isValidObjectId(buildingId)) query.building = buildingId;

    const rules = await MaintenanceRule.find(query)
      .populate("building", "name")
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .sort({ createdAt: -1 });

    return sendSuccessResponse(
      res,
      SUCCESS,
      { rules, count: rules.length },
      "Rules fetched successfully"
    );
  } catch (error) {
    console.error("Error in getAllRules:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const getRuleById = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const societyId = req.society?._id;

    if (!isValidObjectId(ruleId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid rule ID");
    }

    const rule = await MaintenanceRule.findOne({
      _id: ruleId,
      society: societyId,
    })
      .populate("building", "name numberOfFloors")
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email");

    if (!rule) {
      return sendErrorResponse(res, NOT_FOUND, null, "Rule not found");
    }

    return sendSuccessResponse(res, SUCCESS, rule, "Rule fetched successfully");
  } catch (error) {
    console.error("Error in getRuleById:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const updateMaintenanceRule = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const userId = req.user._id;
    const societyId = req.society?._id;

    if (!isValidObjectId(ruleId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid rule ID");
    }

    const rule = await MaintenanceRule.findOne({
      _id: ruleId,
      society: societyId,
    });

    if (!rule) {
      return sendErrorResponse(res, NOT_FOUND, null, "Rule not found");
    }

    const {
      ruleName,
      amountType,
      amount,
      bhkWiseAmounts,
      billingDay,
      dueDays,
      penaltyEnabled,
      penaltyType,
      penaltyValue,
      description,
      isActive,
    } = req.body;

    if (ruleName) rule.ruleName = ruleName;
    if (amountType) rule.amountType = amountType;
    if (amount !== undefined) rule.amount = amount;
    if (bhkWiseAmounts) rule.bhkWiseAmounts = bhkWiseAmounts;
    if (billingDay) rule.billingDay = billingDay;
    if (dueDays !== undefined) rule.dueDays = dueDays;
    if (penaltyEnabled !== undefined) rule.penaltyEnabled = penaltyEnabled;
    if (penaltyType) rule.penaltyType = penaltyType;
    if (penaltyValue !== undefined) rule.penaltyValue = penaltyValue;
    if (description !== undefined) rule.description = description;
    if (isActive !== undefined) rule.isActive = isActive;

    rule.lastModifiedBy = userId;

    await rule.save();
    await rule.populate("building", "name");
    await rule.populate("createdBy", "name email");
    await rule.populate("lastModifiedBy", "name email");

    return sendSuccessResponse(
      res,
      SUCCESS,
      rule,
      "Rule updated successfully"
    );
  } catch (error) {
    console.error("Error in updateMaintenanceRule:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const deleteMaintenanceRule = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const societyId = req.society?._id;

    if (!isValidObjectId(ruleId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid rule ID");
    }

    const rule = await MaintenanceRule.findOneAndDelete({
      _id: ruleId,
      society: societyId,
    });

    if (!rule) {
      return sendErrorResponse(res, NOT_FOUND, null, "Rule not found");
    }

    return sendSuccessResponse(res, SUCCESS, null, "Rule deleted successfully");
  } catch (error) {
    console.error("Error in deleteMaintenanceRule:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const toggleRuleStatus = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const userId = req.user._id;
    const societyId = req.society?._id;

    if (!isValidObjectId(ruleId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid rule ID");
    }

    const rule = await MaintenanceRule.findOne({
      _id: ruleId,
      society: societyId,
    });

    if (!rule) {
      return sendErrorResponse(res, NOT_FOUND, null, "Rule not found");
    }

    rule.isActive = !rule.isActive;
    rule.lastModifiedBy = userId;
    await rule.save();

    await rule.populate("building", "name");
    await rule.populate("createdBy", "name email");

    return sendSuccessResponse(
      res,
      SUCCESS,
      rule,
      `Rule ${rule.isActive ? "activated" : "deactivated"} successfully`
    );
  } catch (error) {
    console.error("Error in toggleRuleStatus:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const getMyApplicableMaintenance = async (req, res) => {
  try {
    const userId = req.user._id;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendSuccessResponse(res, SUCCESS, {
        hasUnit: false,
        maintenance: null,
      });
    }

    const userRel = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
      unit: { $ne: null },
      isActive: true,
    }).populate({
      path: "unit",
      populate: { path: "building", select: "name" },
    });

    if (!userRel || !userRel.unit) {
      return sendSuccessResponse(res, SUCCESS, {
        hasUnit: false,
        maintenance: null,
      });
    }

    const unit = userRel.unit;

    const rules = await MaintenanceRule.find({
      society: societyId,
      isActive: true,
    }).populate("building", "name");

    if (rules.length === 0) {
      return sendSuccessResponse(res, SUCCESS, {
        hasUnit: true,
        unit: {
          name: unit.name,
          bhkType: unit.bhkType,
          building: unit.building?.name,
        },
        maintenance: null,
      });
    }

    let applicableRule = null;
    let highestPriority = 0;

    for (const rule of rules) {
      const applies = rule.appliesTo(unit);
      const priority = rule.priority;

      if (applies && priority > highestPriority) {
        highestPriority = priority;
        applicableRule = rule;
      }
    }

    if (!applicableRule) {
      return sendSuccessResponse(res, SUCCESS, {
        hasUnit: true,
        unit: {
          name: unit.name,
          bhkType: unit.bhkType,
          building: unit.building?.name,
        },
        maintenance: null,
      });
    }

    const baseAmount = applicableRule.calculateAmount(unit);

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        hasUnit: true,
        unit: {
          id: unit._id,
          name: unit.name,
          bhkType: unit.bhkType,
          building: unit.building?.name,
          buildingId: unit.building?._id,
        },
        maintenance: {
          rule: {
            id: applicableRule._id,
            name: applicableRule.ruleName,
            type: applicableRule.ruleType,
            description: applicableRule.description,
          },
          amount: baseAmount,
          billingDay: applicableRule.billingDay,
          dueDays: applicableRule.dueDays,
          penaltyEnabled: applicableRule.penaltyEnabled,
          penaltyType: applicableRule.penaltyType,
          penaltyValue: applicableRule.penaltyValue,
        },
      },
      "Applicable maintenance fetched successfully"
    );
  } catch (error) {
    console.error("Error in getMyApplicableMaintenance:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};
