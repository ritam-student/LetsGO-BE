import {Users} from "../models/Users.models.js" 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import zod from "zod";
import jwt from "jsonwebtoken";
import { Sellers } from "../models/Sellers.models.js";


/**    signup controller    */
export const signupUser =  async (req , res) => {

    try{
        console.log(req.body);
        const requiredBody = zod.object({
            userName: zod.string().min(2).max(40),
            email: zod.string().min(2).max(40).email(),
            password: zod.string().min(8).max(40),
            country: zod.string().min(2).max(40),
            imageUrl: zod.string()
        });
        // validate the incoming body using zod
        const parsedData = requiredBody.safeParse(req.body);
        console.log("parsed data : " , parsedData);

        if (! parsedData.success){
            res.status(404).json(new ApiError(404 , "Bad request..." , parsedData.error));
            return;
        }
    
        const existUser = await Users.findOne({
            $or: [{email: parsedData.data.email} , {userName: parsedData.data.userName}]
        });

        console.log(existUser);

        if (existUser){
            if (existUser.email === parsedData.data.email){
                res.status(409).json(new ApiError(409 , "Email already exist..."));
                return;
            }
            if (existUser.userName === parsedData.data.userName){
                res.status(410).json(new ApiError(410 , "Username already exist..."));
                return;
            }
        }
        // hashed the password using bcrypt
        const hashedPassword = await bcrypt.hash(parsedData.data.password , parseInt(process.env.SALTROUNDS));
    
    
        // save the data in DB
        const user = await Users.create({
            userName: parsedData.data.userName,
            email: parsedData.data.email,
            password: hashedPassword,
            country: parsedData.data.country,
            imageUrl: parsedData.data.imageUrl,
            likes: [],
            dislikes: [],
            saved : []
        });
        console.log("user is : " , user);
        const apiResponse = new ApiResponse(200, user , "signup successfully...");
        console.log(apiResponse);
        res.status(200).json(apiResponse);
    }catch (error){
        res.status(500).json(new ApiError(500, "something went wrong..." , error));
    }

}


/**     signin controller   */
export const signinUser = async (req, res) => {
    try{
        console.log("req body : " , req.body);
        // validate the incoming body
        const requiredBody = zod.object({
            email: zod.string().min(2).max(40).email(),
            password: zod.string().min(8).max(40),
        });

        const parsedData = requiredBody.safeParse(req.body);
        console.log("parsedData : " , parsedData);

        if (! parsedData.success){
            res.status(404).json(new ApiError(404 , "Bad request..." , parsedData.error));
            return;
        }

        // search in the DB
        const userData = await Users.findOne({
            email: parsedData.data.email
        });
        console.log("userdata : " , userData);

        // if exist check the password
        if(userData){
            const passwordMatch = await bcrypt.compare(parsedData.data.password , userData.password);

            

            // if valid password generate a JWT and send it back
            if(passwordMatch){
                const token = await jwt.sign({
                    _id: userData._id
                }, process.env.JWT_SECRET_USER);
                console.log("token is : ", token );

                const isSeller = await Sellers.findOne({
                    userDetails: userData._id
                });
                let data;
                if(isSeller){
                    const sellerToken = await jwt.sign({
                        _id: isSeller._id
                    }, process.env.JWT_SECRET_SELLER);
                    data = {
                        userData,
                        token,
                        sellerToken
                    }
                }else{
                    data = {
                        userData,
                        token
                    }
                }


                
                res.status(200).json(new ApiResponse(200, data , "login successfull..."));
            }else{
                // else return incorrect credentials
                res.status(402).json(new ApiError(402 , "invalid credentials..."));
            }
        }else {

            // else return user does not exist
            res.status(403).json(new ApiError(403 , "user does not exist , please signup..."));
        }

    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error..."));
    }
    
}

/**     getUserProfile controller   */
export const getUserProfile = async (req , res) => {
    try {
        const _id = req._id;
        console.log(_id);
        const user = await Users.findById(_id)
            .populate({
                path: 'likes',
                model: 'Rooms',
                populate: {
                    path: 'owner',
                    model: 'Sellers',
                    populate: {
                        path: "userDetails",
                        model: "Users"  // Ensure this is correct
                    }
                }
            })
            .populate({
                path: 'saved',
                model: 'Rooms',
                populate: {
                    path: 'owner',
                    model: 'Sellers',
                    populate: {
                        path: "userDetails",
                        model: "Users"  // Ensure this is correct
                    }
                }
            });
        if(user){
            res.status(200).json(new ApiResponse(200, user , "data fetched successfully..."))
        }else {
            res.status(402).json(new ApiError(402 , "Can't get user data..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error" , error));
    }

}



/**     getSavedRooms controller   */
export const getSavedRooms = async (req, res) => {
    try {
        const _id = req._id;
        const user = await Users.findById(_id);
        if(user){
            res.status(200).json(new ApiResponse(200, user.saved , "data fetched successfully..."))
        }else {
            res.status(402).json(new ApiError(402 , "Can't get user data..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error" , error));
    }
}


/**     getLikedRooms controller   */
export const getLikedRooms = async (req , res) => {
    try {
        const _id = req._id;
        const user = await Users.findById(_id);
        if(user){
            res.status(200).json(new ApiResponse(200, user.likes , "data fetched successfully..."))
        }else {
            res.status(402).json(new ApiError(402 , "Can't get user data..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error" , error));
    }
}




/**     getDislikedRooms controller   */
export const getDislikedRooms = async (req , res)=> {
    try {
        const _id = req._id;
        const user = await Users.findById(_id);
        if(user){
            res.status(200).json(new ApiResponse(200, user.dislikes , "data fetched successfully..."))
        }else {
            res.status(402).json(new ApiError(402 , "Can't get user data..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error" , error));
    }
} 



/**     deleteSavedRooms controller   */
export const deleteSavedRooms = async (req, res) => {
    try{
        const room_id = req.params._id;
        const _id = req._id;
        const updatedUser = await Users.findByIdAndUpdate(
            _id , 
            { $pull : { saved: room_id} },      // remove that specific room from the array
            { new: true }       // return the updated user details
        )
        if (updatedUser){
            res.status(200).json(new ApiResponse(200 , updatedUser , "Room deleted successfully..."));
        }else {
            res.status(402).json(new ApiError(402 , "Can't get user data..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 ,  "Internal error..." , error));
    }
}


/**     deleteLikedRooms controller   */
export const deleteLikedRooms = async (req , res) => {
    try{
        const room_id = req.params._id;
        const _id = req._id;
        const updatedUser = await Users.findByIdAndUpdate(
            _id , 
            { $pull : { likes: room_id} },      // remove that specific room from the array
            { new: true }       // return the updated user details
        )
        if (updatedUser){
            res.status(200).json(new ApiResponse(200 , updatedUser , "Room deleted successfully..."));
        }else {
            res.status(402).json(new ApiError(402 , "Can't get user data..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 ,  "Internal error..." , error));
    }
}




/**     deleteDislikedRooms controller   */
export const deleteDislikedRooms = async (req , res)=> {
    try{
        const room_id = req.params._id;
        const _id = req._id;
        const updatedUser = await Users.findByIdAndUpdate(
            _id , 
            { $pull : { dislikes: room_id} },      // remove that specific room from the array
            { new: true }       // return the updated user details
        )
        if (updatedUser){
            res.status(200).json(new ApiResponse(200 , updatedUser , "Room deleted successfully..."));
        }else {
            res.status(402).json(new ApiError(402 , "Can't get user data..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 ,  "Internal error..." , error));
    }
} 




/**     deleteProfile controller   */
export const deleteProfile = async (req , res) => {
    try{
        const _id = req._id;
        const user = await Users.deleteOne({_id : _id});
        if (user){
            res.status(200).json(new ApiResponse(200, user , "profile deleted successfully... "))
        }else {
            res.status(402).json(new ApiError(402, "Can't get user data..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500, "Internal error..." , error ));
    }
}




/**     updateProfile controller   */
export const updateProfile = async (req , res) => {
    try{
        const _id = req._id;
        const email = req.body?.email;
        const userName = req.body?.userName;
        const country = req.body?.country;
        const city = req.body?.city;
        const updatedData = {
            email,
            userName,
            country,
            city
        }
        const updatedUser = await Users.findByIdAndUpdate(_id , 
            { $set:updatedData },
            {new: true , runValidators: true}
        );
        if (!updatedData){
            res.status(404).json(new ApiError(404 , "User not found..."));
            return;
        }
        res.status(200).json(new ApiResponse(200 , updatedUser , "User updated successfully..."));
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error..." , error));
    }
}



/**     changePassword controller   */
export const changePassword = async (req , res) => {
    try{
        // take old and new password from the user
        const oldPass = req.body.oldPassword;
        const newPass = req.body.newPassword;
        const _id = req._id;
        // find the user and check if the oldPassword is correct 
        const user = await Users.findById(_id);
        if(!user){
            res.status(402).json(new ApiError(402 , "User not found..."));
            return;
        }

        const isCorrectPassword = await bcrypt.compare(oldPass , user.password);
        if (! isCorrectPassword){
            res.status(403).json(new ApiError(403 , "Wrong password..."));
            return;
        }
        try{
            const updatedUser = await Users.findByIdAndUpdate(_id , {password: newPass});
            res.status(200).json(new ApiResponse(200 , updatedUser, "Password changed successfully..." ));
            return;
        }catch(error){
            res.status(500).json(new ApiError(500 , "Can't change, Try again later..." , error));
            return;
        }
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error..." , error));
    }
}


/**     forgetPassword controller   */
export const forgetPassword = async (req, res) => {
    try{
        const email = req.body.email;
        const newPass = req.body.newPass;

        console.log(email);
        console.log(newPass);

        const hashedPass = await bcrypt.hash(newPass , parseInt(process.env.SALTROUNDS));
        console.log(hashedPass);
        
        const updatedUser = await Users.findOneAndUpdate(
            {email : email},
            {password : hashedPass},
            {new: true}
        );
        console.log(updatedUser);
        if(!updatedUser){
            res.status(404).json(new ApiError(404 , "User not found..."));
            return;
        }else{
            res.status(200).json(new ApiResponse(200 , updatedUser, "Password changed successfully..." ));
            return;
        }
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error...", error ));
    }
}



/**     updateLikedRooms controller   */
export const updateLikedRooms = async (req, res ) => {

    try{
        const _id = req._id;
        const room_id = req.params._id;
        const updatedUser = await Users.findByIdAndUpdate(_id , 
            { $addToSet: {likes: room_id}},         // prevents duplicate entries
            {new: true}
        );
        if (!updatedUser){
            res.status(404).json(new ApiError(404 , "Room can't added..."));
            return;
        }
        res.status(200).json(new ApiResponse(200 , updatedUser , "Room added sucessfully..."));
    }catch(error){
        console.log("internal error");
        res.status(500).json(new ApiError(500 , "Internal error...", error ));
    }
} 





/**     updateDislikedRooms controller   */
export const updateDislikedRooms = async (req, res ) => {
    try{
        const _id = req._id;
        const room_id = req.params._id;
        const updatedUser = await  Users.findByIdAndUpdate(_id , 
            { $addToSet: {dislikes: room_id}},         // prevents duplicate entries
            {new: true}
        );
        if (!updatedUser){
            res.status(404).json(new ApiError(404 , "Room can't added..."));
            return;
        }
        res.status(200).json(new ApiResponse(200 , updatedUser , "Room added sucessfully..."));
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error...", error ));
    }
} 





/**     updateSavedRooms controller   */
export const updateSavedRooms = async (req, res ) => {
    try{
        const _id = req._id;
        const room_id = req.params._id;
        const updatedUser = await Users.findByIdAndUpdate(_id , 
            { $addToSet: {saved: room_id}},         // prevents duplicate entries
            {new: true}
        );
        if (!updatedUser){
            res.status(404).json(new ApiError(404 , "Room can't added..."));
            return;
        }
        res.status(200).json(new ApiResponse(200 , updatedUser , "Room added sucessfully..."));
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error...", error ));
    }
} 