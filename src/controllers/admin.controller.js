import { Course } from "../models/courses.model.js";
import { ApiError } from "../utils/api.error.js";
import { customAlphabet } from "nanoid";
import { API_Response } from "../utils/api.response.js";
// import { nanoid } from "nanoid"

export const createCourse = async (req, res) => {
  const { courseName, coursePrice, courseProvider } = req.body;
  if (
    [courseName, coursePrice, courseProvider].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required for posting the course");
  }
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

  const uniqueCourseCode = nanoid();

  const newCourse = await Course.create({
    courseCode: uniqueCourseCode,
    courseName,
    coursePrice:Number(coursePrice),
    courseProvider,
  });
  
  res
    .status(200)
    .json(
      new API_Response(
        200,
        newCourse,
        "your new course has been created! successfully"
      )
    );
};
