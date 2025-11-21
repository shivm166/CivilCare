import { Building } from "../../models/building.model.js";
import { Society } from "../../models/society.model.js";
import { Unit } from "../../models/unit.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { generateSocietyCode } from "../../utils/generateSocietyCode.js";

export const createSociety = async (req, res) => {
  try {
    const { name, address, city, state, pincode } = req.body;

    if (!name || !address || !city || !state || !pincode) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existedSocietyName = await Society.findOne({ name: name });

    if (existedSocietyName) {
      return res.status(409).json({
        message: "Society name is already exist",
      });
    }

    const existedSocietyAddress = await Society.findOne({ address: address });

    if (existedSocietyAddress) {
      return res.status(409).json({
        message: "Society address is already exist",
      });
    }
    let JoiningCode;
    try {
      JoiningCode = generateSocietyCode(name);
    } catch (error) {
      return res.status(500).json({ message: error.message });
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

    return res.status(201).json({
      message: "society created successfully",
      society,
    });
  } catch (error) {
    console.error("Error in createSociety controller", error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({});
    return res.json({
    success: true,
    societies,
    })
  } catch (error) {
    console.error("Error in getSocieties controller", error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, state, pincode } = req.body;
    const society = await Society.findById(id);

    if (!society) {
      res.status(400).json({
        message: "Society id is not valid",
      });
    }

    const updateSociety = await Society.findByIdAndUpdate(
      id,
      { name, address, city, state, pincode },
      { new: true }
    );
    return res.status(200).json({
      message: "society updated successfully",
      society: updateSociety,
    });
  } catch (error) {
    console.error("Error in updateSociety controller", error);
    return res.status(500).json({ message: "something went wrong" });
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

    return res.json({
      success: true,
      societies: societiesWithMemberCount,
    });
  } catch (error) {
    console.error("Error in getAllSocieties controller", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getSocietyById = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findById(id).populate("createdBy", "name email");

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found",
      });
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

    return res.status(200).json({
      success: true,
      society: {
        ...society.toObject(),
        memberCount,
        buildingCount,
        unitCount,
      },
    });
  } catch (error) {
    console.error("Error in getSocietyById controller", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const deleteSociety = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findById(id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found",
      });
    }

    // Check if society has buildings/units
    const buildingCount = await Building.countDocuments({ society: id });
    const unitCount = await Unit.countDocuments({ society: id });

    if (buildingCount > 0 || unitCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete society. It has ${buildingCount} building(s) and ${unitCount} unit(s). Please delete them first.`,
      });
    }

    // Delete all user-society relationships
    await UserSocietyRel.deleteMany({ society: id });

    // Delete society
    await Society.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Society deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteSociety controller", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}