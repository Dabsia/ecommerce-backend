import { getProductsByUserId } from "../controller/products.controller.js";
import { createUser, getAllUsers, getUser } from "../controller/user.controller.js";
import express from "express";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);


router.get("/user/:userId", getProductsByUserId);

export default router;