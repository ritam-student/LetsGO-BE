import mongoose from "mongoose";
const Schema = mongoose.Schema;



const ReviewSchema = new Schema(
    {
        userDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        RoomId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rooms"
        },
        name: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        ratings : {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Reviews = mongoose.model("Reviews" , ReviewSchema);