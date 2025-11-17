import { isValidObjectId } from "mongoose";
import { Building } from "../../models/building.model";
import { Unit } from "../../models/unit.model";

export const createBuilding = async (req, res) => {
    try {
        const { name, numberOfFloors, description } = req.body;
        const societyId = req.society?._id;
        const userId = req.user._id;

        if(!societyId){
            return res.status(400).json({
                message: "Society context is required"
            })
        }

        // Check if building with same name exists in this society
        const existingBuilding = await Building.findOne({
            name: name.trim(),
            society: societyId,
        });

        if (existingBuilding) {
            return res.status(409).json({
                message: "Building with this name already exists in this society",
            });
        }

        const building = Building.create({
            name: name.trim(),
            numberOfFloors,
            description: description?.trim() || "",
            society: societyId,
            createdBy: userId,
        })

        return res.status(201).json({
            message: "Building Created Successfully",
            building,
        })

    } catch (error) {
        console.log("Error in createBuilding controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllbuildings = async (req, res) => {
    try {
        const societyId = req.society?._id

        if(!societyId){
            return res.status(400).json()
        }

        const building = await Building.find({society: societyId})
            .populate("createdBy", "name email")

        const buildingWithUnitCount = await Promise.all(
            building.map(async (building) => {
                const unitCount = await Unit.countDocuments({
                    building: building._id,
                });
                return {
                    ...building.toObject(),
                    unitCount,
                }
            })
        )

        return res.status(200).json({
            message: "Building fetched Successfully",
            buildingWithUnitCount,
            building,
        })
    } catch (error) {
        console.log("Error in getAllBuildings controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getBuildingById = async (req, res) => {
    try {
        const { id } = req.params;
        const societyId = req.society?._id

        if(!isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid Object Id"
            })
        }

        const building = Building.findOne({
            _id: id,
            society: societyId,
        })

        if(!building){
            res.status(404).json({
                message: "Building Not Found"
            })
        }

        const units = await Unit.find({building: id})
            .populate("owner", "name email phone")
            .populate("primaryResident", "name email phone")

        return res.status(200).json({
            message: "Building Details fetched succesfully",
            building,
            units,
        })
        
    } catch (error) {
        console.log("Error in getBuildingById controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateBuilding = async (req, res) => {
    try {
        const {id} = req.params
        const {name,numberOfFloors, description} = req.body
        const societyId = req.society?._id

        if(!isValidObjectId(id)){
            return res.status(400).json({message: "Invalid building id" })
        }

        const building = await Building.findOne({
            _id: id,
            society: societyId,
        });

        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }

        const existingBuilding = await Building.findOne({
            name: name.trim(),
            society: societyId,
            _id: {$ne: id},
        })

        if(existingBuilding){
            return res.status(409).json({
                message: "Building with this name already exists in this society",
            })
        }

        const updatedBuilding = await Building.findByIdAndUpdate(id, {name, numberOfFloors, description}, {new: true})
        
        return res.status(200).json({
            message: "Building updated successfully",
            building,
        });
    } catch (error) {
        console.log("Error in updateBuilding:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteBuilding = async (req, res) => {
    try {
        const {id} = req.params;
        const societyId = req.society?._id

        if(!isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid building id"
            })
        }

        const unitCount = await Unit.countDocuments({building: id})

        if(unitCount > 0){
            return res.status(400).json({
                message: `Cannot delete building. It has ${unitCount} unit(s) associated with it. Please delete or reassign the units first.`,
            });
        }

        const building = await Building.findOneAndDelete({
            _id: id,
            society: societyId,
        })

        if(!building){
            return res.status(404).json({
                message: "building not found"
            })
        }

        return res.status(200).json({
            message: "building deleted successfully"
        })

    } catch (error) {
        console.log("Error in deleteBuilding:", error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

