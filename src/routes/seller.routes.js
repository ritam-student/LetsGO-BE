import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { allSellers, newSeller } from "../controllers/seller.controller.js";


const sellerRouter = Router();

//  localhost:3000/api/v1/seller/newseller 
sellerRouter.route("/newseller").post(userAuth , newSeller);
sellerRouter.route('/allsellers').get(allSellers);

export default sellerRouter;



