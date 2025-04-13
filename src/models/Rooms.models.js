import mongoose from "mongoose";
const Schema = mongoose.Schema;


const RoomSchema = new Schema({
    title: {
        type : String,
    } ,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sellers"
    },
    description: {
        type : String,
    } ,
    roomsImageUrls : [
        {
            type : String,      // link of the image
            required: true
        }
    ],
    address: {
        type : String,
        required : true
    } ,
    country: {
        type : String,
        required : true
    } ,
    city: {
        type : String,
        required : true
    } ,
    sellerEmail: {
        type: String,
        required: true
    },
    state: {
        type : String,
        required : true
    } ,
    area: {
        type : String,
        required : true
    } ,
    pincode: {
        type : String,
        required : true
    } ,

    price: {
        type : Number,
        required : true
    } ,
    type: {
        type: String,
        required: true
    },
    likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users"
        }
    ],
    dislikes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users"
        }
    ],
    saved: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users"
        }
    ],
    priceUnit: {
        type : String,
        required : true
    } ,
    isAvailable: {
        type: Boolean,
        required: true
    },
    beds: {
        type : String,
        required : true
    } ,
    baths: {
        type : String,
        required : true
    } ,
    amenities: [
        {
            id: String,
            name: String,
            selected: Boolean
        }
    ],
    reviews : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ],
}, {
    timestamps: true
}
);

export const Rooms = mongoose.model("Rooms" , RoomSchema);