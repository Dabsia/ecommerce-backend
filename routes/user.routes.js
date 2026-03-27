import { getProductsByUserId } from "../controller/products.controller.js";
import { getAllUsers, getUser } from "../controller/user.controller.js";
import express from "express";

const router = express.Router();


router.get("/", getAllUsers);
router.get("/:id", getUser);
router.get("/user/:userId", getProductsByUserId);

export default router;