import { Router } from "express";
import { asyncHandler } from "../utils/asynchandler.js";
import { createCourse } from "../controllers/provider.controller.js";

const providerRouter = Router()
providerRouter.route('/upload-course').post(asyncHandler(createCourse))
export {providerRouter};