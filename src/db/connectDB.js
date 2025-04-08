/**
 * 
 * connect with the database
 * 
 */



import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });



export const connectDB = async () => {
    try{
        console.log(process.env.MONGODB_URL);
        const host = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log("DB connected successfully...");
    }catch(error){
        console.log("error is : " , error);
    }
}