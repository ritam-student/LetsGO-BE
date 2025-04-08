import { Reviews } from "../models/Reviews.models.js";
import { Rooms } from "../models/Rooms.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const newReview = async (req , res) => {
    const {id} = req.params;
    const user_id = req._id;
    const name = req.body.name;
    const review = req.body.review;
    const ratings = req.body.ratings ;

    try{
        const newReview = await Reviews.create({
            name: name,
            content: review,
            ratings: ratings,
            userDetails: user_id,
            RoomId: id
        });

        if(!newReview){
            return res.status(400).json(new ApiError(400 , "Can't create new review right now , please try later..."));
        }

        const updatedRoom = await Rooms.findByIdAndUpdate(id , {
            $push: {
                reviews: newReview._id
            }
        } , { new: true });

        if(!updatedRoom){
            return res.status(408).json(new ApiError(408 , "Can't update room, try again later...."));
        }

        res.status(200).json(new ApiResponse(200, updatedRoom , "Review stored sucessfully...."));
    }catch(error){
        return res.status(402).json(new ApiError(402 , "Error while creating your review...." , error));
    }
}