import cloudinary from "cloudinary";

// Configure Cloudinary with credentials from environment variables
const cloud = cloudinary.v2;

cloud.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export default cloud;
