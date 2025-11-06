import { Society } from "../models/society.model.js";
import { UserSocietyRel } from "../models/user_society_rel.model.js";

export const createSociety = async (req, res) => {
  try {
    const { name, address, city, state, pincode } = req.body;

    if (!name || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const society = await Society.create({
      name,
      address,
      city,
      state,
      pincode,
      createdBy: req.user._id,
    });

    await UserSocietyRel.create({
      user: req.user._id,
      society: society._id,
      roleInSociety: "admin",
    });

    return res.status(201).json({
      message: "Society created successfully",
      society,
    });
  } catch (error) {
    console.error("Error in createSociety controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({ createdBy: req.user._id });
    return res.status(200).json({
      message: "Societies fetched successfully",
      count: societies.length,
      societies,
    });
  } catch (error) {
    console.error("Error in getAllSocieties controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSocietyById = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }
    return res.status(200).json({ society });
  } catch (error) {
    console.error("Error in getSocietyById controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateSociety = async (req, res) => {
  try {
    const { name, address, city, state, pincode } = req.body;

    const society = await Society.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { name, address, city, state, pincode },
      { new: true }
    );

    if (!society) {
      return res
        .status(404)
        .json({ message: "Society not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Society updated successfully",
      society,
    });
  } catch (error) {
    console.error("Error in updateSociety controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteSociety = async (req, res) => {
  try {
    const society = await Society.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!society) {
      return res
        .status(404)
        .json({ message: "Society not found or unauthorized" });
    }

    await UserSocietyRel.deleteMany({ society: society._id });

    return res.status(200).json({ message: "Society deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSociety controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


