import {  addToCart, getCart, removeItemFromCart} from "../controller/cart.controller.js";
import express from "express";
import { protect } from "../middleware/index.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", removeItemFromCart);


export default router;