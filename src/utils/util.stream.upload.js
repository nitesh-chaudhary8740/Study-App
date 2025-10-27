import { customAlphabet } from "nanoid";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./api.error.js";
// import { ApiError } from "./api.error.js"; // CRITICAL FIX: Ensure path is correct for your project
import { promisify } from "util"; // Required for cleanup in the controller

// Utility to promisify fs.unlink
export const unlinkFile = promisify(fs.unlink);

export const streamUploadToCloudinary = (moduleFile, folderPath, req) => {
  // Use bytes for total size for precise comparison
  const totalSize = fs.statSync(moduleFile.path).size;
  let bytesUploaded = 0;
  let uploadFinished = false; // Add a status flag

  // Custom ID for logging
  const nanoId = customAlphabet(`ABCDEFGHI1234567890`, 8);
  const streamId = nanoId();

  return new Promise((resolve, reject) => {
    const fileReadableStream = fs.createReadStream(moduleFile.path);
    const uploadWritableFileStream = cloudinary.uploader.upload_stream(
      { folder: folderPath, resource_type: "auto" },
      (error, data) => {
        if (uploadFinished) return; // Prevents execution if client abort handler already fired
        uploadFinished = true; // Set flag on completion/error

        if (error) {
          console.error(`[Cloudinary Error] Stream ID: ${streamId}`, error);
          return reject(new ApiError(500, "Error uploading module file to Cloudinary"));
        }
        console.log(`upload done: ${streamId}`);
        resolve(data);
      }
    );

    fileReadableStream.on("data", (chunk) => {
      bytesUploaded += chunk.length;
      
      const uploadedKB = bytesUploaded / 1024;
      const totalKB = totalSize / 1024;
      
      // Log progress in KB
      if (totalKB > uploadedKB) {
        console.log(` ${streamId} Uploaded: ${uploadedKB.toFixed(0)}kb/${totalKB.toFixed(0)}kb`);
      }
    });

    fileReadableStream.on("error", (err) => {
      if (uploadFinished) return;
      uploadFinished = true;
      console.error(`[Read Stream Error] ID: ${streamId}`, err);
      reject(new ApiError(500, `File read error: ${err.message}`));
    });
    
    req.on("close", () => {
      // Check if upload is not already finished AND if total bytes were not sent
      if (!uploadFinished && bytesUploaded < totalSize) { 
        console.log(`🔴 Upload aborted by client. Stream ID: ${streamId}`);
        fileReadableStream.destroy(); 
        uploadWritableFileStream.destroy();
        uploadFinished = true; // Mark as finished to prevent Cloudinary callback from running
        reject(new ApiError(499, "Client aborted the upload."));
      }
    });

    // CRITICAL: Start the piping
    fileReadableStream.pipe(uploadWritableFileStream);
  });
};