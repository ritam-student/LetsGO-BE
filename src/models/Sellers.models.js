import mongoose from "mongoose";
const Schema = mongoose.Schema;


const SellerSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        userDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        experience: {
            type: String,
            required: true
        },
        rooms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Rooms"
            }
        ]
    }, 
    {
        timestamps: true
    }
);


export const Sellers = mongoose.model("Sellers" , SellerSchema);