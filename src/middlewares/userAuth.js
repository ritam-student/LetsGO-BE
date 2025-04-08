import  jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";


export const userAuth = async (req , res , next) => {
    try{
        const token = req.headers.token;
        console.log(token);
        const response = jwt.verify(token , process.env.JWT_SECRET_USER);
        if (response){
            req._id = response._id;
            console.log("response appreved...");
            next();
        }else{
            res.status(401).json(new ApiError(401 , "Unauthorized access..."));
        }
    }catch(error){
        res.status(500).json(new ApiError(500 , "Internal error..."));
    }
}