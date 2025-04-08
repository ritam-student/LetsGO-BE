import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { newReview } from "../controllers/review.controller.js";

const reviewRouter = Router();

reviewRouter.route("/newreview/:id").post(userAuth , newReview);


export default reviewRouter;