import { Router } from "express";
import stripeController from "../controllers/stripeController.js";
const stripeRouter = Router();
stripeRouter.post("/create-checkout-session", stripeController)
export default stripeRouter;