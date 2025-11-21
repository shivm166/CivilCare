import { Building } from "../../models/building.model.js";
import { Society } from "../../models/society.model.js";
import { Unit } from "../../models/unit.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { generateSocietyCode } from "../../utils/generateSocietyCode.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";

const { SUCCESS, CREATED, DELETED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, SERVER_ERROR } = STATUS_CODES

export const createSociety = async (req, res) => {
  try {
    const { name, address, city, state, pincode } = req.body;

    if (!name || !address || !city || !state || !pincode) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        error - null,
        "All fields are required",
      )
    }

    const existedSocietyName = await Society.findOne({ name: name });

    if (existedSocietyName) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        "Society name is already exist",
      )
    }

    const existedSocietyAddress = await Society.findOne({ address: address });

    if (existedSocietyAddress) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        "Society address is already exist"
      )
    }
    let JoiningCode;
    try {
      JoiningCode = generateSocietyCode(name);
    } catch (error) {
      return sendErrorResponse(
        res,
        SERVER_ERROR,
        error,
        error.message,
      )
    }

    const society = await Society.create({
      name,
      address,
      city,
      state,
      pincode,
      createdBy: req.user._id,
      JoiningCode,
    });

    await UserSocietyRel.create({
      user: req.user._id,
      society: society._id,
      roleInSociety: "admin",
    });

    return sendSuccessResponse(
      res,
      CREATED,
      {
        society,
      },
      "society created successfully"
    )
  } catch (error) {
    console.error("Error in createSociety controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({});
    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        societies,
      },
      "society fetched successfully"
    )
  } catch (error) {
    console.error("Error in getSocieties controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, state, pincode } = req.body;
    const society = await Society.findById(id);

    if (!society) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Please select society"
      )
    }

    const updateSociety = await Society.findByIdAndUpdate(
      id,
      { name, address, city, state, pincode },
      { new: true }
    );

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        society: updateSociety,
      },
      "society updated successfully"
    )
  } catch (error) {
    console.error("Error in updateSociety controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const getAllSocietiesWithUserCount = async (req, res) => {
  try {
    const societies = await Society.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    // Get member count for each society
    const societiesWithMemberCount = await Promise.all(
      societies.map(async (society) => {
        const memberCount = await UserSocietyRel.countDocuments({
          society: society._id,
          isActive: true,
        });

        const buildingCount = await Building.countDocuments({
          society: society._id,
        });

        const unitCount = await Unit.countDocuments({
          society: society._id,
        });

        return {
          ...society.toObject(),
          memberCount,
          buildingCount,
          unitCount,
        };
      })
    );

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        societies: societiesWithMemberCount,
      },
      "Data Fetched Successfully"
    )
  } catch (error) {
    console.error("Error in getAllSocieties controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const getSocietyById = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findById(id).populate("createdBy", "name email");

    if (!society) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Please select Society",
      )
    }

    // Get member count
    const memberCount = await UserSocietyRel.countDocuments({
      society: id,
      isActive: true,
    });

    // Get building count
    const buildingCount = await Building.countDocuments({
      society: id,
    });

    // Get unit count
    const unitCount = await Unit.countDocuments({
      society: id,
    });

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        society: {
          ...society.toObject(),
          memberCount,
          buildingCount,
          unitCount,
        },
      },
      "Data Fetched Successfully"
    )
  } catch (error) {
    console.error("Error in getSocietyById controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const deleteSociety = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findById(id);

    if (!society) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Society not found",
      )
    }

    // Check if society has buildings/units
    const buildingCount = await Building.countDocuments({ society: id });
    const unitCount = await Unit.countDocuments({ society: id });

    if (buildingCount > 0 || unitCount > 0) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Cannot delete society. It has ${buildingCount} building(s) and ${unitCount} unit(s). Please delete them first.`,
      )
    }

    // Delete all user-society relationships
    await UserSocietyRel.deleteMany({ society: id });

    // Delete society
    await Society.findByIdAndDelete(id);

    return sendSuccessResponse(
      res,
      DELETED,
      null,
      "Society deleted successfully"
    )
  } catch (error) {
    console.error("Error in deleteSociety controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
}