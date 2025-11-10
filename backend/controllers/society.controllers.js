import { Society } from "../models/society.model.js";
import { UserSocietyRel } from "../models/user_society_rel.model.js";
import { generateSocietyCode } from "../utils/generateSocietyCode.js";

export const createSociety = async (req, res) => {
  try {
    const { name, address, city, state, pincode } = req.body;

        if (!name || !address || !city || !state || !pincode){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const existedSocietyName = await Society.findOne({name: name})

        if(existedSocietyName){
            return res.status(409).json({
                message: "Society name is already exist"
            })
        }

        const existedSocietyAddress = await Society.findOne({address: address})

        if(existedSocietyAddress){
            return res.status(409).json({
                message: "Society address is already exist"
            })
        }

        try {
            const JoiningCode = generateSocietyCode(name)
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
        })

        await UserSocietyRel.create({
            user: req.user._id,
            society: society._id,
            roleInSociety: "admin"
        })

        return res.status(201).json({
            message: "society created successfully",
            society,
        })

    }catch(error){
        console.error("Error in createSociety controller", error);
        res.status(500).json({ message: "something went wrong" });
    }
}

export const getMySocieties = async (req, res) => {
    try {
        if (req.user.globalRole === "super_admin") {
            const societies = await Society.find({});
            return res.json({
                success: true,
                societies
            });
        }

        const rels = await UserSocietyRel.find({ user: req.user._id })
            .populate("society", "name address city state pincode createdBy");

        console.log(rels)
        const societies = rels.map(r => ({society: r.society, role: r.roleInSociety}));
        
        return res.json(societies);
    } catch (error) {
        console.error("Error in getSocieties controller", error);
        res.status(500).json({ message: "something went wrong" });
    }
};

export const getSocietyById = async (req, res) => {
    try {
        const { id } = req.params;
        const society = await Society.findById(id);
        if (!society) return res.status(404).json({ message: "Society not found" });

        // permission: super_admin or member of that society
        if (req.user.globalRole !== "super_admin") {
            const rel = await UserSocietyRel.findOne({ user: req.user._id, society: id });
            if (!rel)
                {
                    return res.status(403).json({ message: "You can't see others society" });
                }
        }

        return res.json(society);
    } catch (error) {
        console.error("Error in getSocietyById controller", error);
        res.status(500).json({ message: "something went wrong" });
    }
};

export const updateSociety = async (req, res) => {
    try {
        const { id } = req.params
        const { name, address, city, state, pincode} = req.body
        const society = await Society.findById(id)

        if(!society){
            res.status(400).json({
                message: "Society id is not valid"
            })
        }

        const userSocRel = await UserSocietyRel.findOne({user: req.user._id, society: society._id})

        if( req.user.globalRole !== "super_admin" && userSocRel.roleInSociety !== "admin" ){
            return res.status(401).json({ message: "You are not authorise to update this society" });
        }
        
        const updateSociety = await Society.findByIdAndUpdate(id, {name, address, city, state, pincode}, {new: true})
        return res.status(200).json({
            message: "society updated successfully",
            society: updateSociety
        })

    } catch (error) {
        console.error("Error in updateSociety controller", error);
        return res.status(500).json({ message: "something went wrong" });
    }
}

export const deleteSociety = async (req, res) => {
    try {
        const { id } = req.params;

        const society = await Society.findById(id)

        if(!society){
            return res.status(400).json({ message: "Society id is not valid" });
        }

        const userSocRel = await UserSocietyRel.findOne({user: req.user._id, society: society._id})

        if( req.user.globalRole !== "super_admin" && userSocRel.roleInSociety !== "admin" ){
            return res.status(401).json({ message: "You are not authorise to delete this society" });
        }

        await Society.findByIdAndDelete(id);
        await UserSocietyRel.deleteMany({ society: id });
        return res.json({ message: "Society deleted successfully" });
    } catch (error) {
        console.error("Error in deleteSociety controller", error);
        res.status(500).json({ message: "something went wrong" });
    }
};

