import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Use promises version for async
import { configDotenv } from "dotenv";
import { ApiError } from "./api.error.js";
import { extractPublicIdFromUrl } from "./base_url.to.public_url.js";

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
      console.log("file deleted from local",localFile)
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
export const deleteFromCloudinary = async(filePublicId)=>{
try {
  const parsedPublicPath = extractPublicIdFromUrl(filePublicId)
  const response = await cloudinary.uploader.destroy(parsedPublicPath)
  console.log("existing file deleted successfully",response);

} catch (error) {
  console.log("error in upload cloudinary",error)
}
}
export  const deleteFromCloudinaryFolder = async (folderPath,fileType)=>{
try {
  if (fileType ==="video"){
    const res = await cloudinary.api.delete_resources_by_prefix(folderPath,{resource_type:"video"})
    console.log("video resource deleted:",res)
  }
  else{
    const res = await cloudinary.api.delete_resources_by_prefix(folderPath,{resource_type:"raw"})

  }
   const resOfFolder = await cloudinary.api.delete_folder(folderPath)
} catch (error) {
  console.log("error in deleting resource from the cloudinary",error)
  throw new ApiError(500,"error in deleting cloudinary resources")
}
}