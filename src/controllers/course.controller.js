import { customAlphabet } from "nanoid";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { unlinkFile } from "../utils/util.stream.upload.js";

import { Course, Module } from "../models/courses.model.js";
import { ApiError } from "../utils/api.error.js";
import { API_Response } from "../utils/api.response.js";
import { validators } from "../utils/string.validation.js";
import {
  deleteFromCloudinaryFolder,
  uploadOnCloudinary,
} from "../utils/util.cloudinary.js";
import { fetchVideoDuration } from "../utils/util.fetch.video.duration.js";
import { streamUploadToCloudinary } from "../utils/util.stream.upload.js";

export const publishCourse = async (req, res) => {
  const user = req.user;

  const { courseName, coursePrice, courseCategory } = req.body;

  // Validate required fields
  if (!courseName?.trim() || !coursePrice) {
    throw new ApiError(400, "All fields are required for posting the course");
  }

  // Role check
  if (!user.isPublisher) {
    throw new ApiError(403, "Only publishers can create courses");
  }
  //parsing price if price contains other characters besides digits
  const parsedPrice = Number(coursePrice);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    throw new ApiError(400, "Invalid course price");
  }

  // Generate unique course code
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
  const uniqueCourseCode = nanoid();

  const newCourse = await Course.create({
    courseCode: `${user.userName.substring(0, 3)}-${uniqueCourseCode}`,
    courseName: validators.noExtraSpaces(courseName).trim(),
    coursePrice: Number(validators.noExtraSpaces(coursePrice).trim()),
    coursePublisherName: user?.fullName,
    coursePublisher: user._id,
    courseCategory: validators.noExtraSpaces(courseCategory).trim(),
  });

  // Link course back to publisher
  user.publishedCourses.push(newCourse._id);
  //publishedCourses field is an array in User schema
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(
      new API_Response(
        200,
        newCourse,
        "Your new course has been created successfully!"
      )
    );
};
export const fetchUserCourses = async (req, res) => {
  const user = req.user;
  const allUserCourses = await Course.find({ coursePublisher: user._id });
  res
    .status(200)
    .json(
      new API_Response(200, allUserCourses, "courses fetched successfully")
    );
};
export const fetchCourseById = async (req, res) => {
  const courseId = req.params.courseId;
  const fetchedCourse = await Course.findById(courseId);
  if (!fetchedCourse) {
    throw new ApiError(404, "unable to fetch the course");
  }
  res
    .status(200)
    .json(new API_Response(200, fetchedCourse, "course fetched successfully"));
};
export const uploadCourseCoverImage = async (req, res) => {
  const courseId = req.params.courseId;
  const coverImage = req.files?.coverImage?.[0];
  console.log("coverImage", coverImage);
  if (!coverImage) {
    throw new ApiError(400, "No image file provided");
  }
  if (!coverImage.mimetype.startsWith("image/")) {
    throw new ApiError(400, "image format no valid");
  }
  const fetchedCourse = await Course.findById(courseId);
  if (!fetchedCourse) {
    throw new ApiError(404, "unable to fetch the course");
  }

  const coverImageUploadResponse = await uploadOnCloudinary(
    coverImage.path,
    `study-app/courses/${fetchedCourse.courseName}/cover-image`
  );
  fetchedCourse.courseCoverImage = coverImageUploadResponse.url;
  fetchedCourse.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new API_Response(200, fetchedCourse, "image uploaded successfully"));
};
// Assuming ApiError, API_Response, Course, and Module are imported
// Assuming streamUploadToCloudinary and unlinkFile are imported from the utility file


export const uploadModule = async (req, res) => {
  const nanoId = customAlphabet(`R1T2Y3U4I5O6P7A8S9D0`, 6);
  // 🛑 STEP 1: LOG UNIQUE REQUEST ID IMMEDIATELY 🛑
    const requestId = nanoId();
    console.log(`\n--- REQUEST RECEIVED --- ID: ${requestId}`);
  const courseId = req.params.courseId;
  const { moduleTitle } = req.body;
  const moduleFile = req?.files?.moduleFile?.[0];
  const tempFilePath = moduleFile?.path; // Get the path early for cleanup

  if (!moduleTitle || !moduleFile) {
    // Cleanup if fields are missing
    if (tempFilePath) await unlinkFile(tempFilePath).catch(console.error);
    throw new ApiError(400, "Module title and file are required");
  }

  try {
    const fetchedCourse = await Course.findById(courseId);
    if (!fetchedCourse) throw new ApiError(404, "Course not found");

    // --- 1. Determine Duration ---
    const fileType = moduleFile.mimetype.startsWith("video/") ? "video" : "raw";
    let duration = 0;
    if (fileType === "video") {

      duration = await fetchVideoDuration(moduleFile); 
    }

    // --- 2. Cloudinary Upload (Atomic Await) ---
    const folderName = `study-app/courses/${fetchedCourse.courseName.trim()}/modules/${moduleTitle.trim()}`;
    
    // AWAIT ensures code only proceeds if the Promise RESOLVES (upload success)
    const data = await streamUploadToCloudinary(moduleFile, folderName, req);

    // --- 3. Database Write (ONLY on Success) ---
    const moduleTempModel = new Module({
      moduleTitle,
      moduleFile: data.secure_url,
      moduleDuration: duration,
      moduleFileType: fileType,
    });

    fetchedCourse.courseModules.push(moduleTempModel);
    await fetchedCourse.save({ validateBeforeSave: false });

    // --- 4. SUCCESS Cleanup and Response ---
    await unlinkFile(tempFilePath).catch(console.error);

    res
      .status(200)
      .json(new API_Response(200, fetchedCourse, "Module uploaded successfully"));

  } catch (error) {
    // --- 5. FAILURE Cleanup ---
    // Ensure the temporary file is deleted in case of ANY failure (network, DB, abort)
    if (tempFilePath) await unlinkFile(tempFilePath).catch(console.error);

    // Re-throw the error to be handled by your global Express error middleware
    // This stops the request and prevents client retries from running the controller again.
    throw error;
  }
};

//delete a module
export const deleteModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  console.log("courseId", courseId);
  console.log("moduleId", moduleId);
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "course not found");
  }
  const module = course.courseModules.find(
    (module) => moduleId === module._id.toString()
  );

  if (!module) {
    console.log("module ", module);
    throw new ApiError(404, "module not found");
  }

  // await deleteFromCloudinaryFolder(
  //   `study-app/courses/${course.courseName}/modules/${module.moduleTitle}`,
  //   module.moduleFileType
  // );

  course.courseModules = course.courseModules.filter(
    (
      module //remove the module
    ) => module._id.toString() !== moduleId
  );
  await course.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new API_Response(200, course, "module deleted successfully"));
};
