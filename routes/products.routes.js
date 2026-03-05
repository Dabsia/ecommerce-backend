import { getProducts, createProduct, getProductById } from "../controller/products.controller.js   ";
import express from "express";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);

router.get("/:id", getProductById);

export default router;