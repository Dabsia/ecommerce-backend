import {  addToCart, getCart, removeItemFromCart} from "../controller/cart.controller.js";
import express from "express";

const router = express.Router();

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/:productId", removeItemFromCart);


export default router;