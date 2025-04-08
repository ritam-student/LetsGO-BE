
import jwt from "jsonwebtoken";
import { Sellers } from "../models/Sellers.models.js";
import { Users } from "../models/Users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
/**     newseller      
export const newSeller = async (req, res) => {
    const user_id = req._id;
    const state = req.body.state;
    const city = req.body.city;
    const YOE = req.body.YOE;
    const pincode = req.body.pincode;
    const name = req.body.name;

    console.log(name);
    try{
        console.log("line 1");
        const isSellerExist = await Sellers.findOne({ 
            userDetails: user_id 
        });
        console.log(isSellerExist);
        if(isSellerExist){
            res.status(420).json(new ApiResponse(420 , "Seller already exist..."));
        }


        
        const newSeller = await Sellers.create({
            name : name,
            experience: YOE,
            userDetails: user_id,
            rooms: []
        });

        console.log(newSeller);

        console.log("line 2");

        // update user details
        const user = await Users.findByIdAndUpdate(
            user_id,
            {city , state , pincode},
            {new: true , runValidators: true}
        );
        console.log(user);

        if(!user){
            res.status(403).json(new ApiError(403 , "User not found..."));
        }
        console.log(name);
        console.log(YOE);
        console.log(user_id);

        

        

        const sellerToken = await jwt.sign({
            _id: newSeller._id
        }, process.env.JWT_SECRET_SELLER);

        res.status(200).json(new ApiResponse(200 , sellerToken , "Seller created successfully..."));


    }catch(error){
        res.status(500).json(new ApiResponse(500 , "Error while uploading data..." , error));
    }
}




export const newSeller = async (req, res) => {
    try{
        const user_id = req._id;
        const state = req.body.state;
        const city = req.body.city;
        const YOE = req.body.YOE;
        const pincode = req.body.pincode;
        const name = req.body.name;

        console.log(name);

        if(!name || !state || !city || !YOE || !user_id || !pincode){
            console.log("incomplete data...");
            res.status(402).json(new ApiError(402 , "Incomplete data..."));
            
        }

        if(!Sellers){
            console.log("Seller is not found...");
            res.status(501).json(new ApiError(500 , "Seller not found..."));
        }

        console.log(Sellers);


        const isSellerExist = await Sellers.findOne({
            userDetails: user_id
        });

        console.log(isSellerExist);

        if(isSellerExist !== null){
            res.status(420).json(new ApiResponse(420, "Seller already exist...."));
        }

        const newSeller = await Sellers.create({
            name : name,
            experience: YOE,
            userDetails: user_id,
            rooms: []
        });

        console.log(newSeller);

        const user = await Users.findByIdAndUpdate(
            user_id,
            {city , state , pincode},
            {new: true , runValidators: true}
        );

        console.log(user);


        if(!user){
            res.status(403).json(new ApiError(403 , "User not found..."));
        }


        const sellerToken = await jwt.sign({
            _id: newSeller._id
        } , process.env.JWT_SECRET_SELLER);


        res.status(200).json(new ApiResponse(200 , sellerToken , "Seller created successfully"));


    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error..." , error));
    }
}

*/


export const newSeller = async (req , res) => {
    try{
        const user_id = req._id;
        const name = req.body.name;
        const YOE = req.body.YOE;
        const state = req.body.state;
        const city = req.body.city;
        const pincode = req.body.pincode;

        console.log(name , YOE, state , city, pincode , user_id);

        const isSellerExist = await Sellers.findOne({ 
            userDetails: user_id 
        });
        console.log(isSellerExist);
        if(isSellerExist){
            return res.status(420).json(new ApiResponse(420 , "Seller already exist..."));
        }

        const newSeller = await Sellers.create({
            name : name,
            experience: YOE,
            userDetails: user_id,
            rooms: []
        });

        if (!newSeller){
            return res.status(400).json(new ApiError(400 , "Can't create seller..."));
        }

        console.log(newSeller);

        const user = await Users.findByIdAndUpdate(
            user_id,
            {city , state , pincode},
            {new: true , runValidators: true}
        );
        console.log(user);

        if(!user){
            return res.status(403).json(new ApiError(403 , "User not found..."));
        }

        
        const sellerToken = await jwt.sign({
            _id: newSeller._id
        }, process.env.JWT_SECRET_SELLER);

        res.status(200).json(new ApiResponse(200 , sellerToken , "Seller created successfully..."));

    }catch(error){
        res.status(500).json(new ApiError(500, "Internal error here..." , error));
    }
}


export const allSellers = async (req , res) => {
    try{
        const allSellers = await Sellers.find({});
        res.status(200).json(new ApiResponse(200 , allSellers , "all data fetched successfully..."));
    }catch(error){
        res.status(400).json(new ApiError(400, "Internal error..." , error));
    }
}