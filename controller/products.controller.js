// import asyncHandler from "../middleware/asyncHandler.js";
// import Product from "../model/Product.model.js";
// import {validationResult} from 'express-validator'
// import AppError from '../utils/AppError.js'

// export const getProducts = asyncHandler(async (req, res) => {
   
//     const products = await Product.find();
//     res.status(200).json({
//         success: true,
//         message: "Products fetched successfully",
//         data: products
//     });
   
// });

// export const createProduct = asyncHandler(async (req, res) => {
//     // express-validator errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       throw new AppError(errors.array()[0].msg, 400);
//     }
  
//     const { name, price, description, image, category } = req.body;
  
//     // manual validation (optional if using express-validator properly)
//     if (!name || !price || !description || !image || !category) {
//       throw new AppError('All fields are required', 400);
//     }
  
//     // check duplicate
//     const existingProduct = await Product.findOne({ name });
//     if (existingProduct) {
//       throw new AppError('Product with this name already exists', 400);
//     }
  
//     // create product
//     const product = await Product.create(req.body);
  
//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data: product
//     });
//   });


// export const getProductById = async (req, res) => {
//     const { id } = req.params; // destructuring the request params
//     if (!id) {
//         return res.status(400).json({ message: "Product ID is required" });
//     }
//     if (!await Product.findById(id)) {
//         return res.status(400).json({ message: "Product not found" });
//     }
//     try {
//         const product = await Product.findById(req.params.id);
//         res.status(200).json({
//             success: true,
//             message: "Product fetched successfully",
//             data: product
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const updateProduct = async (req, res) => {
//     const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }
//     const { id } = req.params; // destructuring the request params
//     const { name, price, description, image, category } = req.body; // destructuring the request body
//     if (!id) {
//         return res.status(400).json({ message: "Product ID is required" });
//     }
//     if (!name || !price || !description || !image || !category) {
//         return res.status(400).json({ message: "All fields are required" });
//     }
//     try {
//         const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
//         res.status(200).json({
//             success: true,
//             message: "Product updated successfully",
//             data: product
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };  


// export const deleteProduct = async (req, res) => {
//     const { id } = req.params; // destructuring the request params
//     if (!id) {
//         return res.status(400).json({ message: "Product ID is required" });
//     }
//     if (!await Product.findById(id)) {
//         return res.status(400).json({ message: "Product not found" });
//     }
//     try {
//         const product = await Product.findByIdAndDelete(id);
//         res.status(200).json({
//             success: true,
//             message: "Product deleted successfully",
//             data: null
//         }); 
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// export const getProductsByUserId = async (req, res) => {
//     const { userId } = req.params;
//     if (!userId) {
//         return res.status(400).json({ message: "User ID is required" });
//     }
//     try{
//         const products = await Product.find({ userId });
//         res.status(200).json({
//             success: true,
//             message: "Products fetched successfully",
//             data: products
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


import Product from "../model/Product.model.js";
import { UploadService } from "../services/uploadImage.js";
import fs from "fs";

// Create product with image
export const createProduct = async (req, res) => {
    // console.log(req.user)
  try {
    const { name, description, price, category } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      // Clean up uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        message: "Name, description, price, and category are required",
      });
    }
    
    // Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }
    
    // Upload image to Cloudinary
    const uploadedImage = await UploadService.uploadSingleAndClean(req.file, "products");
    
    // Create product in database
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      image: uploadedImage,
      createdBy: req.user._id
    });
    
    // Populate user info
    await product.populate("createdBy", "username email");
    
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
    
  } catch (error) {
    console.error("Error creating product:", error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
 
    const products = await Product.find()
      
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
    
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      data: product,
    });
    
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category} = req.body;
    
    // Find existing product
    const product = await Product.findById(id);
    
    if (!product) {
      // Clean up uploaded file if exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    console.log(product.createdBy)
    console.log(req.user._id)
    // Check authorization
    if (product.createdBy.toString() !== req.user._id.toString()) {
      // Clean up uploaded file if exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }
    
    // Handle image update if new image provided
    let imageData = product.image;
    if (req.file) {
      // Delete old image from Cloudinary
      await UploadService.deleteImageFromCloud(product.image.publicId);
      
      // Upload new image
      imageData = await UploadService.uploadSingleAndClean(req.file, "products");
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price !== undefined ? Number(price) : product.price,
        category: category || product.category,
        
        image: imageData,
        
      },
      { new: true }
    )
    
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
    
  } catch (error) {
    console.error("Error updating product:", error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    // Check authorization
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }
    
    // Delete image from Cloudinary
    await UploadService.deleteImageFromCloud(product.image.publicId);
    
    // Delete product from database
    await Product.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
    
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

export const getProductsByUserId = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try{
        const products = await Product.find({ userId });
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
