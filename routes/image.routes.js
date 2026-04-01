import express from "express";
import {
  uploadImageFile,
  getAllImages,
  deleteImage,
} from "../controller/image.controller.js";

import upload from "../middleware/imageUpload.js";
import { protect } from "../middleware/index.js";

const imageRouter = express.Router();

imageRouter.post(
  "/upload",
  protect,
  upload.single("image"),
  uploadImageFile
);
imageRouter.get("/images", protect, getAllImages);
imageRouter.delete("/images/:id", protect, deleteImage);

export default imageRouter;
