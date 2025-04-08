import { Router } from "express";
import { changePassword, deleteDislikedRooms, deleteLikedRooms, deleteProfile, deleteSavedRooms, forgetPassword, getDislikedRooms, getLikedRooms, getSavedRooms, getUserProfile, signinUser, signupUser,  updateDislikedRooms,  updateLikedRooms,  updateProfile, updateSavedRooms } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/userAuth.js";

const userRouter = Router();

// localhost:3000/api/v1/user/*




// localhost:3000/api/v1/user/signup
userRouter.route("/signup").post(signupUser);
// localhost:3000/api/v1/user/signin
userRouter.route("/signin").post(signinUser);
// localhost:3000/api/v1/user/getUserProfile   -->  _id get from token 
userRouter.route("/getUserProfile").get(userAuth , getUserProfile);
// localhost:3000/api/v1/user/getLikedRooms   -->    _id get from token
userRouter.route("/getLikedRooms").get(userAuth , getLikedRooms);
// localhost:3000/api/v1/user/getSavedRooms   -->    _id get from token
userRouter.route("/getSavedRooms").get(userAuth , getSavedRooms);
// localhost:3000/api/v1/user/getDislikedRooms   -->    _id get from token
userRouter.route("/getDislikedRooms").get(userAuth , getDislikedRooms);
// localhost:3000/api/v1/user/deleteLikedRooms/:id   -->   user _id get from token
userRouter.route("/deleteLikedRooms/:_id").delete(userAuth , deleteLikedRooms);
// localhost:3000/api/v1/user/deleteSavedRooms/:id   -->   user _id get from token
userRouter.route("/deleteSavedRooms/:_id").delete(userAuth , deleteSavedRooms);
// localhost:3000/api/v1/user/deleteDislikedRooms/:id   -->   user _id get from token
userRouter.route("/deleteDislikedRooms/:_id").delete(userAuth , deleteDislikedRooms);
// localhost:3000/api/v1/user/updateProfile   -->   user _id get from token
userRouter.route("/updateProfile").put(userAuth , updateProfile);
// localhost:3000/api/v1/user/deleteProfile   -->   user _id get from token
userRouter.route("/deleteProfile").delete(userAuth , deleteProfile);    // also logout user
// localhost:3000/api/v1/user/changePassword   -->   user _id get from token
userRouter.route("/changePassword").put(userAuth , changePassword);
// localhost:3000/api/v1/user/forgetPassword   -->   user _id get from token
userRouter.route("/forgetPassword").put( forgetPassword);
// localhost:3000/api/v1/user/updateLikedRooms/:id   -->   user _id get from token
userRouter.route("/updateLikedRooms/:_id").put(userAuth , updateLikedRooms);
// localhost:3000/api/v1/user/updateDislikedRooms/:id   -->   user _id get from token
userRouter.route("/updateDislikedRooms/:_id").put(userAuth , updateDislikedRooms);
// localhost:3000/api/v1/user/updateSavedRooms/:id   -->   user _id get from token
userRouter.route("/updateSavedRooms/:_id").put(userAuth , updateSavedRooms);

export default userRouter;