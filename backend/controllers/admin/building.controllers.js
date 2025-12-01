import { isValidObjectId } from "mongoose";
import { Building } from "../../models/building.model.js";
import { Unit } from "../../models/unit.model.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response.js";
import { STATUS_CODES } from "./../../utils/status.js"

const { SUCCESS, CREATED, DELETED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, SERVER_ERROR } = STATUS_CODES

export const createBuilding = async (req, res) => {
    try {
        const { name, numberOfFloors, description } = req.body;
        const societyId = req.society?._id;
        const userId = req.user._id;

        if(!societyId){
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Please Select a Society First"
            )
        }

        // Check if building with same name exists in this society
        const existingBuilding = await Building.findOne({
            name: name.trim(),
            society: societyId,
        });

        if (existingBuilding) {
            return sendErrorResponse(
                res,
                CONFLICT,
                null,
                "Building with this name already exists in this society"
            )
        }

        const building = await Building.create({
            name: name.trim(),
            numberOfFloors,
            description: description?.trim() || "",
            society: societyId,
            createdBy: userId,
        })

        return sendSuccessResponse(
            res,
            CREATED,
            {
                building,
            },
            "Building Created Successfully"
        )

    } catch (error) {
        console.log("Error in createBuilding controller:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const getAllBuildings = async (req, res) => {
    try {
        const societyId = req.society?._id

        if(!societyId){
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Please Select a Society First"
            )
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

        return sendSuccessResponse(
            res,
            SUCCESS,
            {
                buildingWithUnitCount,
                building,
            },
            "Building fetched Successfully"
        ) 
    } catch (error) {
        console.log("Error in getAllBuildings controller:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const getBuildingById = async (req, res) => {
    try {
        const { id } = req.params;
        const societyId = req.society?._id

        if(!isValidObjectId(id)){
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Invalid Building Id"
            )
        }

        const building = await Building.findOne({
            _id: id,
            society: societyId,
        })

        if(!building){
            return sendErrorResponse(
                res,
                NOT_FOUND,
                null,
                "Building Not Found"
            )
        }

        const units = await Unit.find({building: id})
            .populate("owner", "name email phone")
            .populate("primaryResident", "name email phone")

        return sendSuccessResponse(
            res,
            SUCCESS,
            {
                building,
                units,
            },
            "Building Details fetched succesfully"
        )
        
    } catch (error) {
        console.log("Error in getBuildingById controller:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const updateBuilding = async (req, res) => {
    try {
        const {id} = req.params
        const {name,numberOfFloors, description} = req.body
        const societyId = req.society?._id

        if(!isValidObjectId(id)){
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Invalid Building Id"
            )
        }

        const building = await Building.findOne({
            _id: id,
            society: societyId,
        });

        if (!building) {
            return sendErrorResponse(
                res,
                NOT_FOUND,
                null,
                "Building Not Found"
            )
        }

        const existingBuilding = await Building.findOne({
            name: name.trim(),
            society: societyId,
            _id: {$ne: id},
        })

        if(existingBuilding){
            return sendErrorResponse(
                res,
                CONFLICT,
                null,
                "Building with this name already exists in this society",
            )
        }

        const updatedBuilding = await Building.findByIdAndUpdate(id, {name, numberOfFloors, description}, {new: true})
        
        return sendSuccessResponse(
            res,
            SUCCESS,
            {
                building,
            },
            "Building updated successfully"
        )
    } catch (error) {
        console.log("Error in updateBuilding:", error);
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

export const deleteBuilding = async (req, res) => {
    try {
        const {id} = req.params;
        const societyId = req.society?._id

        if(!isValidObjectId(id)){
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                "Invalid Building Id"
            )
        }

        const unitCount = await Unit.countDocuments({building: id})

        if(unitCount > 0){
            return sendErrorResponse(
                res,
                BAD_REQUEST,
                null,
                `Cannot delete building. It has ${unitCount} unit(s) associated with it. Please delete or reassign the units first.`,
            )
        }

        const building = await Building.findOneAndDelete({
            _id: id,
            society: societyId,
        })

        if(!building){
            return sendErrorResponse(
                res,
                NOT_FOUND,
                null,
                "Building Not Found"
            )
        }

        return sendErrorResponse(
            res,
            DELETED,
            null,
            "building deleted successfully"
        )

    } catch (error) {
        console.log("Error in deleteBuilding:", error)
        return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error")
    }
}

