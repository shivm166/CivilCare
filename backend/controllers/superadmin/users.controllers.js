import { Announcement } from "../../models/announcement.model.js"
import Complaint from "../../models/complaint.model.js"
import { Society } from "../../models/society.model.js"
import { User } from "../../models/user.model.js"
import { UserSocietyRel } from "../../models/user_society_rel.model.js"

export const getAllUsers = async (req, res) =>{
    try {
        const users = await User.find({}).select("-password")
        return res.status(200).json({
            users
        })
    } catch (error) {
        console.log("Error in getAllUsers controller", error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSocieties = await Society.countDocuments();
    const totalComplaints = await Complaint.countDocuments({ status: "pending" });
    const totalAnnouncements = await Announcement.countDocuments();

    return res.status(200).json({
      totalUsers,
      totalSocieties,
      totalComplaints,
      totalAnnouncements,
    });
  } catch (error) {
    console.log("Error in getStats controller", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's societies
    const societies = await UserSocietyRel.find({
      user: id,
      isActive: true,
    })
      .populate("society", "name city state")
      .select("roleInSociety society");

    return res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        societies,
      },
    });
  } catch (error) {
    console.log("Error in getUserById controller", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is super_admin
    if (user.globalRole === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete a super admin user",
      });
    }

    // Delete user's society relationships
    await UserSocietyRel.deleteMany({ user: id });

    // Delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteUser controller", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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

    return res.status(200).json({
      success: true,
      users: usersWithSocietyCount,
    });
  } catch (error) {
    console.log("Error in getAllUsers controller", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, globalRole } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate globalRole if provided
    if (globalRole && !["user", "super_admin"].includes(globalRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid global role. Must be 'user' or 'super_admin'",
      });
    }

    // Prevent self-demotion (super admin removing their own super_admin role)
    if (
      user._id.toString() === req.user._id.toString() &&
      globalRole === "user" &&
      user.globalRole === "super_admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot remove your own super admin privileges",
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (globalRole) user.globalRole = globalRole;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        globalRole: user.globalRole,
      },
    });
  } catch (error) {
    console.log("Error in updateUser controller", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};