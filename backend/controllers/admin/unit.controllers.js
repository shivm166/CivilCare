import { Building } from "../../models/building.model.js";
import { Unit } from "../../models/unit.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { isValidObjectId } from "mongoose";

export const createUnit = async (req, res) => {
    try {
        const { buildingId } = req.params;
        const { name, floor, type, owner, primaryResident } = req.body;
        const societyId = req.society?._id;

        if (!isValidObjectId(buildingId)) {
            return res.status(400).json({ message: "Invalid building ID" });
        }

        // Verify building exists in this society
        const building = await Building.findOne({
            _id: buildingId,
            society: societyId,
        });

        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }

        // Check if unit with same name exists in this building
        const existingUnit = await Unit.findOne({
            name: name.trim(),
            building: buildingId,
        });

        if (existingUnit) {
            return res.status(409).json({
                message: "Unit with this name already exists in this building",
            });
        }

        // Validate floor number
        if (floor > building.numberOfFloors) {
            return res.status(400).json({
                message: `Floor number cannot exceed building's floor count (${building.numberOfFloors})`,
            });
        }

        const unit = await Unit.create({
            name: name.trim(),
            floor,
            building: buildingId,
            society: societyId,
            type: type || "vacant",
            owner: owner || null,
            primaryResident: primaryResident || null,
        });

        const populatedUnit = await Unit.findById(unit._id)
        .populate("owner", "name email phone")
        .populate("primaryResident", "name email phone");

        return res.status(201).json({
            message: "Unit created successfully",
            unit: populatedUnit,
        });
    } catch (error) {
        console.log("Error in createUnit:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUnitsInBuilding = async (req, res) => {
    try {
        const { buildingId } = req.params;
        const societyId = req.society?._id;

        if (!isValidObjectId(buildingId)) {
            return res.status(400).json({ message: "Invalid building ID" });
        }

        // Verify building exists
        const building = await Building.findOne({
            _id: buildingId,
            society: societyId,
        });

        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }

        const units = await Unit.find({ building: buildingId })
            .populate("owner", "name email phone")
            .populate("primaryResident", "name email phone")
            .sort({ floor: 1, name: 1 });

        return res.status(200).json({
            message: "Units fetched successfully",
            units,
        });
    } catch (error) {
        console.log("Error in getUnitsInBuilding:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUnit = async (req, res) => {
    try {
        const { unitId } = req.params;
        const { name, floor, type, owner, primaryResident } = req.body;
        const societyId = req.society?._id;

        if (!isValidObjectId(unitId)) {
            return res.status(400).json({ message: "Invalid unit ID" });
        }

        const unit = await Unit.findOne({
            _id: unitId,
            society: societyId,
        });

        if (!unit) {
            return res.status(404).json({ message: "Unit not found" });
        }

        // Get building to validate floor
        const building = await Building.findById(unit.building);
        if (floor && floor > building.numberOfFloors) {
            return res.status(400).json({
                message: `Floor number cannot exceed building's floor count (${building.numberOfFloors})`,
            });
        }

        // Check if new name conflicts
        if (name && name !== unit.name) {
            const existingUnit = await Unit.findOne({
                name: name.trim(),
                building: unit.building,
                _id: { $ne: unitId },
            });

            if (existingUnit) {
                return res.status(409).json({
                message: "Unit with this name already exists in this building",
                });
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

        return res.status(200).json({
        message: "Unit updated successfully",
        unit: updatedUnit,
        });
    } catch (error) {
        console.log("Error in updateUnit:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUnit = async (req, res) => {
    try {
        const { unitId } = req.params;
        const societyId = req.society?._id;

        if (!isValidObjectId(unitId)) {
            return res.status(400).json({ message: "Invalid unit ID" });
        }

        const unit = await Unit.findOneAndDelete({
            _id: unitId,
            society: societyId,
        });

        if (!unit) {
            return res.status(404).json({ message: "Unit not found" });
        }

        // Remove unit reference from UserSocietyRel
        await UserSocietyRel.updateMany(
            { unit: unitId },
            { $unset: { unit: "" } }
        );

        return res.status(200).json({
            message: "Unit deleted successfully",
        });
    } catch (error) {
        console.log("Error in deleteUnit:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const assignResidentToUnit = async (req, res) => {
    try {
        const { unitId } = req.params;
        const { userId, role } = req.body; // role: 'owner', 'member', 'tenant'
        const societyId = req.society?._id;

        if (!isValidObjectId(unitId) || !isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid unit or user ID" });
        }

        const unit = await Unit.findOne({
            _id: unitId,
            society: societyId,
        });

        if (!unit) {
            return res.status(404).json({ message: "Unit not found" });
        }

        // Check if user is already a member of this society
        let userSocietyRel = await UserSocietyRel.findOne({
            user: userId,
            society: societyId,
        });

        if (!userSocietyRel) {
            return res.status(400).json({
                message: "User must be a member of the society first",
            });
        }

        // Update unit assignment
        userSocietyRel.unit = unitId;
        userSocietyRel.roleInSociety = role || "member";
        await userSocietyRel.save();

        // Update unit owner/primaryResident based on role
        if (role === "owner") {
            unit.owner = userId;
            unit.type = "owner_occupied";
        } else if (role === "tenant") {
            unit.primaryResident = userId;
            unit.type = "tenant_occupied";
        } else {
            unit.primaryResident = userId;
        }

        await unit.save();

        const updatedUnit = await Unit.findById(unitId)
            .populate("owner", "name email phone")
            .populate("primaryResident", "name email phone");

        return res.status(200).json({
            message: "Resident assigned to unit successfully",
            unit: updatedUnit,
        });
    } catch (error) {
        console.log("Error in assignResidentToUnit:", error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}