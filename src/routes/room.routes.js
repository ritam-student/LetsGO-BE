import { Router } from "express";
import {  dislikeRoom, getAllApartment, getAllHostels, getAllMess, getAllPG, getAllRooms, likeRoom, newRoom, saveRoom, searchedRoomsFromAll, searchedRoomsFromApartment, searchedRoomsFromHostels, searchedRoomsFromMess, searchedRoomsFromPg, showRoomDetails, undislikeRoom, unlikeRoom, unsaveRoom } from "../controllers/room.controller.js";
import { userAuth } from "../middlewares/userAuth.js";
import { sellerAuth } from "../middlewares/sellerAuth.js";

const roomRouter = Router();


roomRouter.route("/").get(getAllRooms);
roomRouter.route("/hostel").get(getAllHostels);
roomRouter.route("/pg").get(getAllPG);
roomRouter.route("/apartment").get(getAllApartment);
roomRouter.route("/mess").get(getAllMess);
roomRouter.route("/roomdetails/:id").get(userAuth , showRoomDetails);
roomRouter.route('/newroom').post(sellerAuth , newRoom);
roomRouter.route('/searchFromAll').get(searchedRoomsFromAll);
roomRouter.route('/searchFromHostel').get(searchedRoomsFromHostels);
roomRouter.route('/searchFromMess').get(searchedRoomsFromMess);
roomRouter.route('/searchFromPg').get(searchedRoomsFromPg);
roomRouter.route('/searchFromApartment').get(searchedRoomsFromApartment);
roomRouter.route('/:id/like').put(userAuth , likeRoom);
roomRouter.route('/:id/unlike').put(userAuth , unlikeRoom);
roomRouter.route('/:id/dislike').put(userAuth , dislikeRoom);
roomRouter.route('/:id/undislike').put(userAuth , undislikeRoom);
roomRouter.route('/:id/save').put(userAuth , saveRoom);
roomRouter.route('/:id/unsave').put(userAuth , unsaveRoom);



export default roomRouter;