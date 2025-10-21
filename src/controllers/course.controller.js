import { customAlphabet } from "nanoid";
import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import { Course, Module } from "../models/courses.model.js";
import { ApiError } from "../utils/api.error.js";
import { API_Response } from "../utils/api.response.js";
import { validators } from "../utils/string.validation.js";
import { deleteFromCloudinaryFolder, uploadOnCloudinary } from "../utils/util.cloudinary.js";

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
  req.on("close",()=>{
    console.log("singal aborted")
    return res.status(300).json(new API_Response(300,{},"upload is cancel"))
  })
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

  let duration = 0;
  const fileType = moduleFile.mimetype.startsWith("video/") ? "video" : "raw";
try {
  if (moduleFile.mimetype.startsWith("video/") ) {
    const info = await ffprobe(moduleFile.path,{path:ffprobeStatic.path})
    duration = Math.round((parseFloat(info?.streams?.[0].duration)/60))
  }
} catch (error) {
  console.log("error in video parse",error)
  throw new ApiError(500, "error in uploading parsing video")
}

  // ✅ Upload file to Cloudinary (deletes local file inside)
  const response = await uploadOnCloudinary(
    moduleFile.path,
    `study-app/courses/${fetchedCourse.courseName.trim()}/modules/${moduleTitle.trim()}`
  );
  if (!response) {
    throw new ApiError(500, "Error uploading module file");
  }
  // ✅ Save module to course
  const moduleTempModel = new Module({
    moduleTitle,
    moduleFile: response.url,
    moduleDuration: duration,
    moduleFileType:fileType
  });

  fetchedCourse.courseModules.push(moduleTempModel);
  await fetchedCourse.save({ validateBeforeSave: false });

  res.status(200).json(new API_Response(200, fetchedCourse, "New module added successfully"));
};

//delete a module
export const deleteModule = async (req,res)=>{
  const {courseId,moduleId} = req.params;
  console.log("courseId",courseId)
  console.log("moduleId",moduleId)
  const course = await Course.findById(courseId)
  if(!course){
    throw new ApiError(404, "course not found")
  }
 const module = course.courseModules.find((module)=>
    moduleId ===module._id.toString()
 )

 if(!module){
  console.log("module ",module)
  throw new ApiError(404,"module not found")
 }

// await deleteFromCloudinaryFolder(`study-app/courses/${course.courseName}/modules/${module.moduleTitle}`,module.moduleFileType)

  course.courseModules = course.courseModules.filter(module=> //remove the module
    module._id.toString() !== moduleId
  )
  await course.save({validateBeforeSave:false})
  res.status(200).json(new API_Response(200,course,"module deleted successfully"))
}