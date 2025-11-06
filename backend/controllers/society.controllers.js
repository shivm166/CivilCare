import { Society } from "../models/society.model.js"
import { UserSocietyRel } from "../models/user_society_rel.model.js"

export const createSociety = async (req,res) =>{
    try{
        const { name, address, city, state, pincode} = req.body

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

        const society = await Society.create({
            name,
            address,
            city,
            state,
            pincode,
            createdBy: req.user._id
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