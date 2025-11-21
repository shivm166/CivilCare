import { Building } from "../../models/building.model.js";
import { Unit } from "../../models/unit.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { isValidObjectId } from "mongoose";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";

const { SUCCESS, CREATED, DELETED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, SERVER_ERROR } = STATUS_CODES

export const createUnit = async (req, res) => {
    try {
        const { buildingId } = req.params;
        const { name, floor, bhkType, type, owner, primaryResident } = req.body;
        const societyId = req.society?._id;

        if (!isValidObjectId(buildingId)) {
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Invalid Building Id"
            )
        }

        // Verify building exists in this society
        const building = await Building.findOne({
            _id: buildingId,
            society: societyId,
        });

        if (!building) {
            return sendErrorResponse(
                res,
                NOT_FOUND,
                null,
                "Building Not Found"
            )
        }

        // Check if unit with same name exists in this building
        const existingUnit = await Unit.findOne({
            name: name.trim(),
            building: buildingId,
        });

        if (existingUnit) {
            return sendErrorResponse(
                res,
                CONFLICT,
                null,
                "Unit with this name already exists in this building",
            )
        }

        // Validate floor number
        if (floor > building.numberOfFloors) {
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                `Floor number cannot exceed building's floor count (${building.numberOfFloors})`,
            )
        }

        const unit = await Unit.create({
            name: name.trim(),
            floor,
            building: buildingId,
            society: societyId,
            bhkType: bhkType,
            type: type || "vacant",
            owner: owner || null,
            primaryResident: primaryResident || null,
        });

        const populatedUnit = await Unit.findById(unit._id)
        .populate("owner", "name email phone")
        .populate("primaryResident", "name email phone");

        return sendSuccessResponse(
            res,
            CREATED,
            {
                unit: populatedUnit,
            },
            "Unit created successfully",
        )
    } catch (error) {
        console.log("Error in createUnit:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const getUnitsInBuilding = async (req, res) => {
    try {
        const { buildingId } = req.params;
        const societyId = req.society?._id;

        if (!isValidObjectId(buildingId)) {
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Invalid Building Id"
            )
        }

        // Verify building exists
        const building = await Building.findOne({
            _id: buildingId,
            society: societyId,
        });

        if (!building) {
            return sendErrorResponse(
                res,
                NOT_FOUND,
                null,
                "Building Not Found"
            )
        }

        const units = await Unit.find({ building: buildingId })
            .populate("owner", "name email phone")
            .populate("primaryResident", "name email phone")
            .sort({ floor: 1, name: 1 });

        return sendSuccessResponse(
            res,
            SUCCESS,
            {
                units,
            },
            "Units fetched successfully"
        )
    } catch (error) {
        console.log("Error in getUnitsInBuilding:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const updateUnit = async (req, res) => {
    try {
        const { unitId } = req.params;
        const { name, floor, type, owner, primaryResident } = req.body;
        const societyId = req.society?._id;

        if (!isValidObjectId(unitId)) {
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Invalid unit Id"
            )
        }

        const unit = await Unit.findOne({
            _id: unitId,
            society: societyId,
        });

        if (!unit) {
            return sendErrorResponse(
                res,
                NOT_FOUND,
                null,
                "Unit not found"
            )
        }

        // Get building to validate floor
        const building = await Building.findById(unit.building);
        if (floor && floor > building.numberOfFloors) {
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                `Floor number cannot exceed building's floor count (${building.numberOfFloors})`,
            )
        }

        // Check if new name conflicts
        if (name && name !== unit.name) {
            const existingUnit = await Unit.findOne({
                name: name.trim(),
                building: unit.building,
                _id: { $ne: unitId },
            });

            if (existingUnit) {
                return sendErrorResponse(
                    res,
                    CONFLICT,
                    null,
                    "Unit with this name already exists in this building",
                )
            }
        }

        // Update fields
        if (name) unit.name = name.trim();
        if (floor) unit.floor = floor;
        if (type) unit.type = type;
        if (owner !== undefined) unit.owner = owner;
        if (primaryResident !== undefined) unit.primaryResident = primaryResident;

        await unit.save();

        const updatedUnit = await Unit.findById(unitId)
        .populate("owner", "name email phone")
        .populate("primaryResident", "name email phone");

        return sendSuccessResponse(
            res,
            SUCCESS,
            {
                unit: updatedUnit,
            },
            "Unit updated successfully",
        )
    } catch (error) {
        console.log("Error in updateUnit:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const deleteUnit = async (req, res) => {
    try {
        const { unitId } = req.params;
        const societyId = req.society?._id;

        if (!isValidObjectId(unitId)) {
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Invalid unit Id"
            )
        }

        const unit = await Unit.findOneAndDelete({
            _id: unitId,
            society: societyId,
        });

        if (!unit) {
            return sendErrorResponse(
                res,
                NOT_FOUND,
                null,
                "Unit not found"
            )
        }

        // Remove unit reference from UserSocietyRel
        await UserSocietyRel.updateMany(
            { unit: unitId },
            { $unset: { unit: "" } }
        );

        return sendSuccessResponse(
            res,
            DELETED,
            null,
            "Unit deleted successfully",
        )

    } catch (error) {
        console.log("Error in deleteUnit:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const assignResidentToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { userId, unitRole } = req.body;
    const societyId = req.society?._id;

    if (!isValidObjectId(unitId) || !isValidObjectId(userId)) {
        return sendErrorResponse(
            res,
            BAD_REQUEST,
            "Invalid unit or user ID",
        )
    }

    const unit = await Unit.findOne({
      _id: unitId,
      society: societyId,
    });

    if (!unit) {
        return sendErrorResponse(
            res,
            NOT_FOUND,
            null,
            "Unit not found"
        )
    }

    // Check if user is already a member of this society
    let userSocietyRel = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
    });

    if (!userSocietyRel) {
        return sendErrorResponse(
            res,
            BAD_REQUEST,
            null,
            "User must be a member of the society first"
        )
    }

    const allowedUnitRoles = ["owner", "member", "tenant"];
    if (!unitRole || !allowedUnitRoles.includes(unitRole)) {
        return sendErrorResponse(
            res,
            BAD_REQUEST,
            null,
            "Invalid unit role. Allowed: owner, member, tenant"
        )
    }

    userSocietyRel.unit = unitId;
    userSocietyRel.unitRole = unitRole;
    await userSocietyRel.save();

    // Update unit owner/primaryResident based on unitRole
    if (unitRole === "owner") {
      unit.owner = userId;
      unit.type = "owner_occupied";
    } else if (unitRole === "tenant") {
      unit.primaryResident = userId;
      unit.type = "tenant_occupied";
    } else {
      unit.primaryResident = userId;
    }

    await unit.save();

    const updatedUnit = await Unit.findById(unitId)
      .populate("owner", "name email phone")
      .populate("primaryResident", "name email phone");

    return sendSuccessResponse(
        res,
        SUCCESS,
        {
            unit: updatedUnit,
            userRole: {
                primaryRole: userSocietyRel.roleInSociety,
                unitRole: userSocietyRel.unitRole,
            },
        },
        "Resident assigned to unit successfully"
    )
  } catch (error) {
    console.log("Error in assignResidentToUnit:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const getUnitById = async (req, res) => {
    try {
        const { unitId } = req.params;
        const societyId = req.society?._id;

        if (!isValidObjectId(unitId)) {
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Invalid unit ID"
            )
        }

        const unit = await Unit.findOne({
            _id: unitId,
            society: societyId,
        })
            .populate("owner", "name email phone")
            .populate("primaryResident", "name email phone")
            .populate("building", "name numberOfFloors");

        if (!unit) {
            return sendErrorResponse(
                res,
                NOT_FOUND,
                null,
                "Unit not found"
            )
        }

        return sendSuccessResponse(
            res,
            SUCCESS,
            {
                unit,
                building: unit.building,
            },
            "Unit details fetched successfully"
        )
    } catch (error) {
        console.log("Error in getUnitById:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
};