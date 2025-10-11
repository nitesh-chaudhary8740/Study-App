import { customAlphabet } from "nanoid";
import Ffmpeg from "fluent-ffmpeg";
import { Course, Module } from "../models/courses.model.js";
import { ApiError } from "../utils/api.error.js";
import { API_Response } from "../utils/api.response.js";
import { validators } from "../utils/string.validation.js";
import { uploadOnCloudinary } from "../utils/util.cloudinary.js";

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
export const fetchUserCourses = async (req,res)=>{
  const user = req.user;
  const allUserCourses = await Course.find({coursePublisher:user._id})
  res.status(200).json(new API_Response(200,allUserCourses,"courses fetched successfully"))
}
export const fetchCourseById = async (req,res)=>{
  const courseId = req.params.courseId;
  const fetchedCourse = await Course.findById(courseId)
  if(!fetchedCourse){
    throw new ApiError(404,"unable to fetch the course")
  }
  res.status(200).json(new API_Response(200,fetchedCourse,"course fetched successfully"))
}
export const uploadCourseCoverImage = async(req,res) =>{
  const courseId  = req.params.courseId;
  const coverImage = req.files?.coverImage?.[0];
  console.log("coverImage",coverImage)
   if (!coverImage) {
    throw new ApiError(400, "No image file provided");
  }
  if(!(coverImage.mimetype.startsWith("image/"))){
    throw new ApiError(400,"image format no valid")
  }
  const fetchedCourse = await Course.findById(courseId)
  if(!fetchedCourse){
    throw new ApiError(404,"unable to fetch the course")
  }
  
  const coverImageUploadResponse = await uploadOnCloudinary(coverImage.path,`study-app/courses/${fetchedCourse.courseName}/cover-image`)
  fetchedCourse.courseCoverImage = coverImageUploadResponse.url;
  fetchedCourse.save({validateBeforeSave:false})
  
   res.status(200).json(new API_Response(200,fetchedCourse,"image uploaded successfully"))
}
export const uploadModule = async (req, res) => {
  const courseId = req.params.courseId;
  const { moduleTitle } = req.body;
  const moduleFile = req?.files?.moduleFile?.[0];

  if (!moduleTitle || !moduleFile) {
    throw new ApiError(400, "All fields are required", ["moduleTitle", "moduleFile"]);
  }

  const fetchedCourse = await Course.findById(courseId);
  if (!fetchedCourse) {
    throw new ApiError(404, "No course found!");
  }

  const response = await uploadOnCloudinary(
    moduleFile.path,
    `study-app/courses/${fetchedCourse.courseName}/modules/${moduleTitle}`
  );
if(!response){
  throw new ApiError(500,"error in upload moduleFile")
}
let duration = 0;
if(moduleFile.mimetype.startsWith("video/")){
duration = await new Promise((resolve,reject)=>{
  Ffmpeg.ffprobe(moduleFile.path,(err,data)=>{
    if(err) reject(new ApiError(500,"Error is extacting duration"))
      resolve(data.format.duration)
  })
})
}
 const moduleTempModel = new Module({
    moduleTitle,
    moduleContent: response.url,
    moduleDuration:duration
  });

  fetchedCourse.courseModules.push(moduleTempModel);
  await fetchedCourse.save({ validateBeforeSave: false });

  res.status(200).json(new API_Response(200, fetchedCourse, "New module added successfully"));
};
