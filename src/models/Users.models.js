import mongoose from "mongoose";
const Schema = mongoose.Schema;


const UserSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        imageUrl: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        city: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            
        },
        pincode: {
            type: String,
            
        },
        saved: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Rooms"
            }
        ], 
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Rooms"
            }
        ], 
        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Rooms"
            }
        ], 
        bookedRooms : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Rooms"
            }
        ]
    } , 
    {
        timestamps: true
    }
);


export const Users = mongoose.model("Users" , UserSchema);