import { getProducts, createProduct, getProductById, updateProduct, deleteProduct} from "../controller/products.controller.js   ";
import express from "express";
import {adminOnly, protect} from "../middleware/index.js";

const router = express.Router();

router.get("/", protect, adminOnly, getProducts);
router.post("/", protect,createProduct);

router.get("/:id", protect, getProductById);
router.patch("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);



export default router;