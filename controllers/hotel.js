const RoomModel = require('../models/hotel');
const jwt = require('jsonwebtoken');

const AdminModel = require('../models/admin');

const createRoom = async (req, res) => {
    try{
        const incomingData = req.body;
        const newRoom = new RoomModel(incomingData);
        const data = await newRoom.save();
        return res.status(201).json({
            message:"Create Room Successfully",
            data
        })        
    } catch(error) {
        return res.status(500).json({
            message: "There was an error",
            error
        })
    }
}

const getAllRoom = async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    let decodeToken;
    
    if(token) {
        decodeToken = jwt.verify(token, process.env.SECRETKEY);

        try{
            const ifAdminExists = await AdminModel.findOne({email: decodeToken.email});

            if (ifAdminExists) {
                const data = await RoomModel.find();
                return res.status(200).json({
                    message: "Successfully Fetched Room",
                    data
                })
            } else {
                return res.status(401).json({
                    message: "You are not authorized",
                    error
                })
            }
        } catch(error) {
            return res.status(500).json({
                message: "There was an error",
                error
            })
        }
    } else {
        return res.status(401).json({
            message: "You need to provide access token"
        })
    }
    
}

const deleteRoom = async (req, res) => {
    try{
        const id = req.params.id;
        const data = await RoomModel.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Delete Room Successfully",
            data
        })
    } catch(error) {
        return res.status(500).json({
            message: "There was an error",
            error
        })
    }
}

const updateRoom = async (req, res) => {
    try {
        const incomingData = req.body;
        const id = req.params.id;
        const data = await RoomModel.findByIdAndUpdate(id, incomingData, {returnOriginal: false});
        return res.status(200).json({
            message: "Updated Room Successfully",
            data
        })
    } catch(error) {
        return res.status(500).json({
            message: "There was an error",
            error
        })
    }
}

const getRoomById = async (req, res) => {
    const id = req.params.id;
    try {
        const roomData = await RoomModel.findById(id);
        return res.status(200).json({
            message: "Fetched Room By ID Successfully",
            roomData
        })
    } catch(error) {
        return res.status(500).json({
            message: "There was an error",
            error
        })
    }   
}




module.exports = {
    createRoom,
    getAllRoom,
    deleteRoom,
    updateRoom,
    getRoomById
}
