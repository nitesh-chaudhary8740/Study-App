import { customAlphabet } from "nanoid";
import { Course } from "../models/courses.model.js";
import { ApiError } from "../utils/api.error.js";
import { API_Response } from "../utils/api.response.js";
import { validators } from "../utils/string.validation.js";

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
