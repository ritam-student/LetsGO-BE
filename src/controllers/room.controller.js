
import { Rooms } from "../models/Rooms.models.js";
import { Sellers } from "../models/Sellers.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Users } from "../models/Users.models.js";


export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Rooms.find({})
            .populate({
                path: 'owner',
                model: 'Sellers',
                populate: {
                    path: "userDetails",
                    model: "Users"  // Ensure this is correct
                }
            });
        console.log(rooms);
        console.log(rooms[0].owner);
        console.log(rooms[0].owner.userDetails);
        res.status(200).json(new ApiResponse(200 , rooms , "fetch done"));
    } catch (error) {
        console.error(error);
        res.status(500).send(new ApiError(400, "something wrong ...", error));
    }
}







// return the details of a single room
export const showRoomDetails = async (req, res) => {    // add authentication check for seller
    try{
        const {id} = req.params;        // room id
        const _id = req._id;
        console.log(id);
        const roomDetails = await Rooms.findById(id)
            .populate({
                path: 'reviews',
                model: 'Reviews',
                populate: {
                    path: 'userDetails',
                    model: 'Users'
                }
            })
            .populate({
                path: 'owner',
                model: 'Sellers',
                populate: {
                    path: "userDetails",  // Nested populate to get user details
                    model: "Users"
                }
            })
            .populate({
                path: 'reviews',
                model: 'Reviews',
                populate: {
                    path: "userDetails",
                    model: "Users"
                }
            });

        if(!roomDetails){
            return res.status(404).json(new ApiError(404 , "Room not found..."));
        }
        console.log(roomDetails);
        const user  = await Users.findById(_id);
        if(!user){
            return res.status(404).json(new ApiError(404 , "user not found..."));
        }

        res.status(200).json(new ApiResponse(200 , {roomDetails , user} , "Data fetched successfully..."));
        
    }catch(error){
        console.log(error);
        return res.status(500).json(new ApiError(500, "Error while getting room details..." , error));
    }
} 


export const  getAllHostels = async (req, res) => {
    try{
        const allHostel = await Rooms.find({type : 'Hostel'})
            .populate({
                path: 'owner',
                model: 'Sellers',
                populate: {
                    path: "userDetails",
                    model: "Users"  // Ensure this is correct
                }
            });
        if(!allHostel){
            return res.status(404).json(new ApiError(404 , "No Hostel found..."));
        }
        console.log(allHostel);
        res.status(200).json(new ApiResponse(200 , allHostel , "All hostel fetched successfully..."));
    }catch(error){
        return res.status(500).json(new ApiError(500, "Error while getting rooms details..."))
    }
}




export const  getAllPG = async (req, res) => {
    try{
        const allPg = await Rooms.find({type : 'Pg'})
            .populate({
                path: 'owner',
                model: 'Sellers',
                populate: {
                    path: "userDetails",
                    model: "Users"  // Ensure this is correct
                }
            });
        if(!allPg){
            return res.status(404).json(new ApiError(404 , "No PG found..."));
        }
        return res.status(200).json(new ApiResponse(200 , allPg , "All PG fetched successfully..."));
    }catch(error){
        return res.status(500).json(new ApiError(500, "Error while getting rooms details..."))
    }
}




export const  getAllApartment = async (req, res) => {
    try{
        const allApartment = await Rooms.find({type : 'Apartment'})
            .populate({
                path: 'owner',
                model: 'Sellers',
                populate: {
                    path: "userDetails",
                    model: "Users"  // Ensure this is correct
                }
            });
        if(!allApartment){
            return res.status(404).json(new ApiError(404 , "No apartment found..."));
        }
        return res.status(200).json(new ApiResponse(200 , allApartment , "All apartment fetched successfully..."));
    }catch(error){
        return res.status(500).json(new ApiError(500, "Error while getting rooms details..."))
    }
}


export const getAllMess = async (req , res) => {
    try{
        const allMess = await Rooms.find({type : 'Mess'})
            .populate({
                path: 'owner',
                model: 'Sellers',
                populate: {
                    path: "userDetails",
                    model: "Users"  // Ensure this is correct
                }
            });
        if(!allMess){
            return res.status(404).json(new ApiError(404 , "No mess found..."));
        }
        return res.status(200).json(new ApiResponse(200 , allMess , "All mess fetched successfully..."));
    }catch(error){
        return res.status(500).json(new ApiError(500, "Error while getting rooms details..."))
    }
}


export const newRoom = async (req , res) => {
    try{
        const {email, houseName, description, address, price,country,type,city,state,area,pincode,images,isAc,isKitchen,isSingleBed,isWifi} = req.body;
        console.log(isAc);
        console.log(email);
        console.log(images);
        const seller_id = req.seller_id;
        console.log(seller_id);
        const newRoom = await Rooms.create({
            houseName,
            owner: seller_id,
            description,
            roomsImageUrls: images || [],
            address,
            country,
            city,
            state,
            area,
            pincode,
            price,
            type,
            isAc,
            isKitchen,
            isSingleBed,
            freeWifi: isWifi,
            sellerEmail: email
        });
        console.log(newRoom);
        const seller = await Sellers.findByIdAndUpdate(seller_id, {
            $push: { rooms: newRoom._id }  // add the room id to the seller's rooms array
        }, { new: true });
        console.log(seller);
        if (!seller) {
            return res.status(404).json(new ApiError(404 , "Seller not found..."));
        }
        res.status(200).json(new ApiResponse(200 , newRoom , "Room created successfully...."));
    }catch(error){
        res.status(500).json(new ApiError(500, "Internal error...." , error));
    }
}



export const searchedRoomsFromAll = async (req , res) => {
    try {
        const { query } = req.query; // Get search query from user input
        console.log("from backend : " , query);
        if (!query) {
          return res.status(400).json({ message: "Search query is required" });
        }
    
        // Create a case-insensitive regex pattern
        const regex = new RegExp(query, "i");
    
        // Search in multiple fields using $or
        const rooms = await Rooms.find({
          $or: [
            { address: regex },
            { area: regex },
            { state: regex },
            { city: regex },
            { country: regex },
            { pincode: regex },
          ],
        })
        .populate({
            path: 'owner',
            model: 'Sellers',
            populate: {
                path: "userDetails",
                model: "Users"  // Ensure this is correct
            }
        });

        console.log("res is : ", rooms);
    
        res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched sucessfully..."));
    } catch (error) {
        console.error("Error searching rooms:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export const searchedRoomsFromHostels = async (req , res) => {
    try {
        const { query } = req.query; // Get search query from user input
        console.log("from backend : " , query);
        if (!query) {
          return res.status(400).json({ message: "Search query is required" });
        }
    
        // Create a case-insensitive regex pattern
        const regex = new RegExp(query, "i");
    
        // Search in multiple fields using $or
        const rooms = await Rooms.find({
          $and: [
            {type: 'Hostel'},
            {
                $or: [
                    { address: regex },
                    { area: regex },
                    { state: regex },
                    { city: regex },
                    { country: regex },
                    { pincode: regex },
                  ],
            },
          ],
        })
        .populate({
            path: 'owner',
            model: 'Sellers',
            populate: {
                path: "userDetails",
                model: "Users"  // Ensure this is correct
            }
        });

        console.log("res is : ", rooms);
    
        res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched sucessfully..."));
    } catch (error) {
        console.error("Error searching rooms:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export const searchedRoomsFromMess = async (req , res) => {
    try {
        const { query } = req.query; // Get search query from user input
        console.log("from backend : " , query);
        if (!query) {
          return res.status(400).json({ message: "Search query is required" });
        }
    
        // Create a case-insensitive regex pattern
        const regex = new RegExp(query, "i");
    
        // Search in multiple fields using $or
        const rooms = await Rooms.find({
          $and: [
            {type: 'Mess'},
            {
                $or: [
                    { address: regex },
                    { area: regex },
                    { state: regex },
                    { city: regex },
                    { country: regex },
                    { pincode: regex },
                  ],
            },
          ],
        })
        .populate({
            path: 'owner',
            model: 'Sellers',
            populate: {
                path: "userDetails",
                model: "Users"  // Ensure this is correct
            }
        });

        console.log("res is : ", rooms);
    
        res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched sucessfully..."));
    } catch (error) {
        console.error("Error searching rooms:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




export const searchedRoomsFromPg = async (req , res) => {
    try {
        const { query } = req.query; // Get search query from user input
        console.log("from backend : " , query);
        if (!query) {
          return res.status(400).json({ message: "Search query is required" });
        }
    
        // Create a case-insensitive regex pattern
        const regex = new RegExp(query, "i");
    
        // Search in multiple fields using $or
        const rooms = await Rooms.find({
          $and: [
            {type: 'Pg'},
            {
                $or: [
                    { address: regex },
                    { area: regex },
                    { state: regex },
                    { city: regex },
                    { country: regex },
                    { pincode: regex },
                  ],
            },
          ],
        })
        .populate({
            path: 'owner',
            model: 'Sellers',
            populate: {
                path: "userDetails",
                model: "Users"  // Ensure this is correct
            }
        });

        console.log("res is : ", rooms);
    
        res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched sucessfully..."));
    } catch (error) {
        console.error("Error searching rooms:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




export const searchedRoomsFromApartment = async (req , res) => {
    try {
        const { query } = req.query; // Get search query from user input
        console.log("from backend : " , query);
        if (!query) {
          return res.status(400).json({ message: "Search query is required" });
        }
    
        // Create a case-insensitive regex pattern
        const regex = new RegExp(query, "i");
    
        // Search in multiple fields using $or
        const rooms = await Rooms.find({
          $and: [
            {type: 'Apartment'},
            {
                $or: [
                    { address: regex },
                    { area: regex },
                    { state: regex },
                    { city: regex },
                    { country: regex },
                    { pincode: regex },
                  ],
            },
          ],
        })
        .populate({
            path: 'owner',
            model: 'Sellers',
            populate: {
                path: "userDetails",
                model: "Users"  // Ensure this is correct
            }
        });

        console.log("res is : ", rooms);
    
        res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched sucessfully..."));
    } catch (error) {
        console.error("Error searching rooms:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export const saveRoom = async (req , res) => {
    const {id} = req.params;        // room id
    const _id = req._id;

    try{
        const roomDetails = await Rooms.findByIdAndUpdate(id,
            {
                $addToSet: {
                    saved: _id
                }
            },
            {new: true}
        );
        if(!roomDetails){
            return res.status(404).json(new ApiError(404 , "Unable to get room's data..."));
            
        }

        const user = await Users.findByIdAndUpdate(_id,
            {
                $addToSet: {
                    saved: id
                }
            },
            {new: true}
        );
        if(!user){
            return res.status(404).json(new ApiError(404 , "Can't get user details..."));

        }
        res.status(200).json(new ApiResponse(200 , user , "Room saved sucessfully..."));

    }catch(error){
        return res.status(500).json(new ApiError(500 , "Error while saving the room..." , error));
    }
}


export const likeRoom = async (req , res) => {
    const {id} = req.params;        // room id
    const _id = req._id;

    try{
        const roomDetails = await Rooms.findByIdAndUpdate(id,
            {
                $addToSet: {
                    likes: _id
                },
                $pull:{
                    dislikes: _id
                }
            },
            {new: true}
        );
        if(!roomDetails){
            return res.status(404).json(new ApiError(404 , "Unable to get room's data..."));
            
        }
        

        const user = await Users.findByIdAndUpdate(_id,
            {
                $addToSet: {
                    likes: id
                },
                $pull: {
                    dislikes: id
                }
            },
            {new: true}
        );
        if(!user){
            return res.status(404).json(new ApiError(404 , "Can't get user details..."));

        }
        res.status(200).json(new ApiResponse(200 , user , "Room liked sucessfully..."));

    }catch(error){
        return res.status(500).json(new ApiError(500 , "Error while like the room..." , error));
    }
}


export const dislikeRoom = async (req , res) => {
    const {id} = req.params;        // room id
    const _id = req._id;

    try{
        const roomDetails = await Rooms.findByIdAndUpdate(id,
            {
                $addToSet: {
                    dislikes: _id
                },
                $pull: {
                    likes: _id
                }
            },
            {new: true}
        );
        if(!roomDetails){
            return res.status(404).json(new ApiError(404 , "Unable to get room's data..."));
            
        }

        const user = await Users.findByIdAndUpdate(_id,
            {
                $addToSet: {
                    dislikes: id
                },
                $pull: {
                    likes: id
                }
            },
            {new: true}
        );
        if(!user){
            return res.status(404).json(new ApiError(404 , "Can't get user details..."));

        }
        res.status(200).json(new ApiResponse(200 , user , "Room disliked sucessfully..."));

    }catch(error){
        return res.status(500).json(new ApiError(500 , "Error while dislike the room..." , error));
    }
}


export const undislikeRoom = async (req , res) => {
    const {id} = req.params;        // room id
    const _id = req._id;

    try{
        const roomDetails = await Rooms.findByIdAndUpdate(id,
            {
                $pull: {
                    dislikes: _id
                }
            },
            {new: true}
        );
        if(!roomDetails){
            return res.status(404).json(new ApiError(404 , "Unable to get room's data..."));
            
        }

        const user = await Users.findByIdAndUpdate(_id,
            {
                $pull: {
                    dislikes: id
                }
            },
            {new: true}
        );
        if(!user){
            return res.status(404).json(new ApiError(404 , "Can't get user details..."));

        }
        res.status(200).json(new ApiResponse(200 , user , "Room undisliked sucessfully..."));

    }catch(error){
        return res.status(500).json(new ApiError(500 , "Error while undislike the room..." , error));
    }
}



export const unlikeRoom = async (req , res) => {
    const {id} = req.params;        // room id
    const _id = req._id;

    try{
        const roomDetails = await Rooms.findByIdAndUpdate(id,
            {
                $pull: {
                    likes: _id
                }
            },
            {new: true}
        );
        if(!roomDetails){
            return res.status(404).json(new ApiError(404 , "Unable to get room's data..."));
            
        }

        const user = await Users.findByIdAndUpdate(_id,
            {
                $pull: {
                    likes: id
                }
            },
            {new: true}
        );
        if(!user){
            return res.status(404).json(new ApiError(404 , "Can't get user details..."));

        }
        res.status(200).json(new ApiResponse(200 , user , "Room unliked sucessfully..."));

    }catch(error){
        return res.status(500).json(new ApiError(500 , "Error while unlike the room..." , error));
    }
}



export const unsaveRoom = async (req , res) => {
    const {id} = req.params;        // room id
    const _id = req._id;

    try{
        const roomDetails = await Rooms.findByIdAndUpdate(id,
            {
                $pull: {
                    saved: _id
                }
            },
            {new: true}
        );
        if(!roomDetails){
            return res.status(404).json(new ApiError(404 , "Unable to get room's data..."));
            
        }

        const user = await Users.findByIdAndUpdate(_id,
            {
                $pull: {
                    saved: id
                }
            },
            {new: true}
        );
        if(!user){
            return res.status(404).json(new ApiError(404 , "Can't get user details..."));

        }
        res.status(200).json(new ApiResponse(200 , user , "Room unsaved sucessfully..."));

    }catch(error){
        return res.status(500).json(new ApiError(500 , "Error while unsaving the room..." , error));
    }
}