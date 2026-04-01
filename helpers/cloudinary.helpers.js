import cloud from "../config/cloudinary.js";

// Upload single image
export const uploadImage = async (filePath, folder = "products") => {
  try {
    const result = await cloud.uploader.upload(filePath, {
      folder: folder,
    });
    return { 
      url: result.secure_url, 
      publicId: result.public_id 
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    await cloud.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image");
  }
};