import { Announcement } from "../../models/announcement.model.js"
import Complaint from "../../models/complaint.model.js"
import { Society } from "../../models/society.model.js"
import { User } from "../../models/user.model.js"
import { UserSocietyRel } from "../../models/user_society_rel.model.js"
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response.js"
import { STATUS_CODES } from "../../utils/status.js"

const { SUCCESS, CREATED, DELETED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, SERVER_ERROR } = STATUS_CODES

export const getAllUsers = async (req, res) =>{
    try {
      const users = await User.find({}).select("-password")
      return sendSuccessResponse(
        res,
        SUCCESS,
        {
          users
        },
        "Users fetched successfully"
      )
    } catch (error) {
        console.log("Error in getAllUsers controller", error)
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSocieties = await Society.countDocuments();
    const totalComplaints = await Complaint.countDocuments({ status: "pending" });
    const totalAnnouncements = await Announcement.countDocuments();

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        totalUsers,
        totalSocieties,
        totalComplaints,
        totalAnnouncements,
      },
      "Stats fetched successfully"
    )
  } catch (error) {
    console.log("Error in getStats controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {

      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "User not found",
      )
    }

    // Get user's societies
    const societies = await UserSocietyRel.find({
      user: id,
      isActive: true,
    })
      .populate("society", "name city state")
      .select("roleInSociety society");

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        user: {
          ...user.toObject(),
          societies,
        },
      },
      "user fetched successfully"
    )
  } catch (error) {
    console.log("Error in getUserById controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user._id.toString()) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You cannot delete your own account"
      )
    }

    const user = await User.findById(id);

    if (!user) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "User not found"
      )
    }

    // Check if user is super_admin
    if (user.globalRole === "super_admin") {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Cannot delete a super admin user",
      )
    }

    // Delete user's society relationships
    await UserSocietyRel.deleteMany({ user: id });

    // Delete user
    await User.findByIdAndDelete(id);

    return sendSuccessResponse(
      res,
      SUCCESS,
      null,
      "User deleted successfully"
    )
  } catch (error) {
    console.log("Error in deleteUser controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const getUserWithSocietyCount = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password") // Don't send password
      .sort({ createdAt: -1 });

    // Get society count for each user
    const usersWithSocietyCount = await Promise.all(
      users.map(async (user) => {
        const societyCount = await UserSocietyRel.countDocuments({
          user: user._id,
          isActive: true,
        });

        return {
          ...user.toObject(),
          societyCount,
        };
      })
    );

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        users: usersWithSocietyCount,
      },
      "Data fetched successfully"
    )
  } catch (error) {
    console.log("Error in getAllUsers controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, globalRole } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        "User not found",
      )
    }

    // Validate globalRole if provided
    if (globalRole && !["user", "super_admin"].includes(globalRole)) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Invalid global role. Must be 'user' or 'super_admin'"
      )
    }

    // Prevent self-demotion (super admin removing their own super_admin role)
    if (
      user._id.toString() === req.user._id.toString() &&
      globalRole === "user" &&
      user.globalRole === "super_admin"
    ) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You cannot remove your own super admin privileges",
      )
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (globalRole) user.globalRole = globalRole;

    await user.save();

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          globalRole: user.globalRole,
        },
      },
      "User updated successfully"
    )
  } catch (error) {
    console.log("Error in updateUser controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
  }
};