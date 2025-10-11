import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Use promises version for async
import { configDotenv } from "dotenv";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFile, folderName) => {
  if (!localFile) return null;

  try {
    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
      folder: folderName,
    });

    // Delete local file asynchronously
    try {
      await fs.unlink(localFile);
    } catch (err) {
      console.error("Failed to delete local file:", err);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Delete local file even if upload fails
    try {
      await fs.unlink(localFile);
    } catch (err) {
      console.error("Failed to delete local file after failed upload:", err);
    }

    return null;
  }
};
