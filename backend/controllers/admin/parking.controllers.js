import { Parking } from "../../models/parking.model.js";
import { Unit } from "../../models/unit.model.js";
import { User } from "../../models/user.model.js";
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

// ==================== ADMIN PARKING CONTROLLERS ====================

// 🏗️ Allocate unit-based parking
export const allocateUnitParking = async (req, res) => {
  try {
    const { parkingNumber, unitId, vehicleType, vehicleNumber, parkingLevel, remarks } = req.body;
    const societyId = req.society._id;

    // Validate required fields
    if (!parkingNumber || !unitId) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Parking number and unit are required");
    }

    // Validate unit exists
    const unit = await Unit.findById(unitId).populate("building");
    if (!unit) {
      return sendErrorResponse(res, NOT_FOUND, null, "Unit not found");
    }

    // Check if parking number already exists in society
    const existingParking = await Parking.findOne({
      society: societyId,
      parkingNumber: parkingNumber.trim(),
    });

    if (existingParking) {
      return sendErrorResponse(res, CONFLICT, null, "Parking number already exists in this society");
    }

    // Create unit-based parking
    const parking = await Parking.create({
      parkingNumber: parkingNumber.trim(),
      allocationType: "unit_based",
      unit: unitId,
      building: unit.building._id,
      society: societyId,
      vehicleType: vehicleType || "two_wheeler",
      vehicleNumber: vehicleNumber?.trim().toUpperCase() || "",
      parkingLevel: parkingLevel || "ground",
      remarks: remarks || "",
      allocatedBy: req.user._id,
      status: "active",
    });

    const populatedParking = await Parking.findById(parking._id)
      .populate("unit", "name unitNumber type floor") // ✅ ADDED: name field
      .populate("building", "name")
      .populate("allocatedBy", "name email");

    return sendSuccessResponse(
      res,
      CREATED,
      populatedParking,
      "Unit-based parking allocated successfully"
    );
  } catch (error) {
    console.error("Error in allocateUnitParking:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to allocate parking");
  }
};

// 👤 Allocate general parking (for members without units)
export const allocateGeneralParking = async (req, res) => {
  try {
    const { parkingNumber, memberId, vehicleType, vehicleNumber, parkingLevel, remarks } = req.body;
    const societyId = req.society._id;

    // Validate required fields
    if (!parkingNumber || !memberId) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Parking number and member are required");
    }

    // Validate member exists and is part of society
    const memberRel = await UserSocietyRel.findOne({
      user: memberId,
      society: societyId,
      isActive: true,
    }).populate("user", "name email phone");

    if (!memberRel) {
      return sendErrorResponse(res, NOT_FOUND, null, "Member not found in this society");
    }

    // Check if parking number already exists
    const existingParking = await Parking.findOne({
      society: societyId,
      parkingNumber: parkingNumber.trim(),
    });

    if (existingParking) {
      return sendErrorResponse(res, CONFLICT, null, "Parking number already exists in this society");
    }

    // Create general parking
    const parking = await Parking.create({
      parkingNumber: parkingNumber.trim(),
      allocationType: "general",
      member: memberId,
      society: societyId,
      vehicleType: vehicleType || "two_wheeler",
      vehicleNumber: vehicleNumber?.trim().toUpperCase() || "",
      parkingLevel: parkingLevel || "ground",
      remarks: remarks || "",
      allocatedBy: req.user._id,
      status: "active",
    });

    const populatedParking = await Parking.findById(parking._id)
      .populate("member", "name email phone")
      .populate("allocatedBy", "name email");

    return sendSuccessResponse(
      res,
      CREATED,
      populatedParking,
      "General parking allocated successfully"
    );
  } catch (error) {
    console.error("Error in allocateGeneralParking:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to allocate parking");
  }
};

// 📋 Get all parkings in society
export const getAllParkings = async (req, res) => {
  try {
    const societyId = req.society._id;
    const { allocationType, status, search } = req.query;

    // Build query
    const query = { society: societyId };

    if (allocationType && ["unit_based", "general"].includes(allocationType)) {
      query.allocationType = allocationType;
    }

    if (status && ["active", "inactive"].includes(status)) {
      query.status = status;
    }

    // Get all parkings
    let parkings = await Parking.find(query)
      .populate("unit", "name unitNumber type floor") // ✅ ADDED: name field
      .populate("building", "name")
      .populate("member", "name email phone")
      .populate("allocatedBy", "name email")
      .sort({ createdAt: -1 });

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      parkings = parkings.filter((parking) => {
        const parkingNumber = parking.parkingNumber?.toLowerCase() || "";
        const unitNumber = parking.unit?.unitNumber?.toLowerCase() || "";
        const unitName = parking.unit?.name?.toLowerCase() || ""; // ✅ ADDED: search by unit name
        const memberName = parking.member?.name?.toLowerCase() || "";
        const vehicleNumber = parking.vehicleNumber?.toLowerCase() || "";

        return (
          parkingNumber.includes(searchTerm) ||
          unitNumber.includes(searchTerm) ||
          unitName.includes(searchTerm) || // ✅ ADDED
          memberName.includes(searchTerm) ||
          vehicleNumber.includes(searchTerm)
        );
      });
    }

    return sendSuccessResponse(
      res,
      SUCCESS,
      { parkings, count: parkings.length },
      "Parkings fetched successfully"
    );
  } catch (error) {
    console.error("Error in getAllParkings:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to fetch parkings");
  }
};

// 🔍 Get parking by ID
export const getParkingById = async (req, res) => {
  try {
    const { parkingId } = req.params;

    if (!isValidObjectId(parkingId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid parking ID");
    }

    const parking = await Parking.findById(parkingId)
      .populate("unit", "name unitNumber type floor") // ✅ ADDED: name field
      .populate("building", "name")
      .populate("member", "name email phone")
      .populate("allocatedBy", "name email");

    if (!parking) {
      return sendErrorResponse(res, NOT_FOUND, null, "Parking not found");
    }

    return sendSuccessResponse(res, SUCCESS, parking, "Parking fetched successfully");
  } catch (error) {
    console.error("Error in getParkingById:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to fetch parking");
  }
};

// ✏️ Update parking
export const updateParking = async (req, res) => {
  try {
    const { parkingId } = req.params;
    const { vehicleType, vehicleNumber, parkingLevel, status, remarks } = req.body;

    if (!isValidObjectId(parkingId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid parking ID");
    }

    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return sendErrorResponse(res, NOT_FOUND, null, "Parking not found");
    }

    // Update allowed fields
    if (vehicleType) parking.vehicleType = vehicleType;
    if (vehicleNumber !== undefined) parking.vehicleNumber = vehicleNumber.trim().toUpperCase();
    if (parkingLevel) parking.parkingLevel = parkingLevel;
    if (status) parking.status = status;
    if (remarks !== undefined) parking.remarks = remarks;

    await parking.save();

    const updatedParking = await Parking.findById(parkingId)
      .populate("unit", "name unitNumber type floor") // ✅ ADDED: name field
      .populate("building", "name")
      .populate("member", "name email phone")
      .populate("allocatedBy", "name email");

    return sendSuccessResponse(res, SUCCESS, updatedParking, "Parking updated successfully");
  } catch (error) {
    console.error("Error in updateParking:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to update parking");
  }
};

// 🗑️ Delete parking
export const deleteParking = async (req, res) => {
  try {
    const { parkingId } = req.params;

    if (!isValidObjectId(parkingId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid parking ID");
    }

    const parking = await Parking.findByIdAndDelete(parkingId);

    if (!parking) {
      return sendErrorResponse(res, NOT_FOUND, null, "Parking not found");
    }

    return sendSuccessResponse(res, SUCCESS, null, "Parking deleted successfully");
  } catch (error) {
    console.error("Error in deleteParking:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to delete parking");
  }
};

// ==================== USER PARKING CONTROLLERS ====================

// 🏠 Get my parking (for logged-in user)
export const getMyParking = async (req, res) => {
  try {
    const userId = req.user._id;
    const societyId = req.society._id;

    // Find user's relation in society
    const userRel = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
      isActive: true,
    });

    if (!userRel) {
      return sendSuccessResponse(res, SUCCESS, { parkings: [] }, "No parkings found");
    }

    const query = { society: societyId, status: "active" };

    // Get both unit-based and general parkings
    const conditions = [];

    // If user has a unit, get unit-based parking
    if (userRel.unit) {
      conditions.push({ unit: userRel.unit });
    }

    // Get general parking assigned directly to user
    conditions.push({ member: userId, allocationType: "general" });

    if (conditions.length === 0) {
      return sendSuccessResponse(res, SUCCESS, { parkings: [] }, "No parkings found");
    }

    const parkings = await Parking.find({
      ...query,
      $or: conditions,
    })
      .populate("unit", "name unitNumber type floor") // ✅ ADDED: name field
      .populate("building", "name")
      .sort({ createdAt: -1 });

    return sendSuccessResponse(
      res,
      SUCCESS,
      { parkings, count: parkings.length },
      "My parkings fetched successfully"
    );
  } catch (error) {
    console.error("Error in getMyParking:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Failed to fetch your parkings");
  }
};
