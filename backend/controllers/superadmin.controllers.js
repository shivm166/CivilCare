import { Announcement } from "../models/announcement.model.js"
import { Complaint } from "../models/complaint.model.js"
import { Society } from "../models/society.model.js"
import { User } from "../models/user.model.js"

export const getAllUsers = async (req, res) =>{
    try {
        const users = await User.find({})
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

export const getStats = async (req, res) =>{
    try {
        const totalUsers = await User.find({}).countDocuments()
        const totalSocieties = await Society.find({}).countDocuments()
        const totalComplaints = await Complaint.find({status: "pending"}).countDocuments()
        const totalAnnouncements = await Announcement.find({}).countDocuments()

        return res.status(200).json({
            totalUsers,
            totalSocieties,
            totalComplaints,
            totalAnnouncements,
        })
    } catch (error) {
        console.log("Error in getStats controller", error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}