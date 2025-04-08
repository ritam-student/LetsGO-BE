import mongoose from "mongoose";
const Schema = mongoose.Schema;


const RoomSchema = new Schema({
    houseName: {
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
        enum: ["Apartment", "Pg", "Hostel", "Mess"],
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
    isAC: {
        type: Boolean,
        required: true
    },
    isSingleBed: {
        type : Boolean,
        required : true
    },
    isKitchen: {
        type : Boolean
    },
    freeWifi : {
        type: Boolean
    },
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