import  jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";


export const sellerAuth = async (req , res , next) => {
    try{
        const sellerToken = req.headers.sellerToken || req.headers.sellertoken;
        console.log(sellerToken);
        const response = jwt.verify(sellerToken , process.env.JWT_SECRET_SELLER);
        if (response){
            req.seller_id = response._id;
            console.log("response appreved...");
            next();
        }else{
            res.status(401).json(new ApiError(401 , "Unauthorized access..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error..."));
    }
}