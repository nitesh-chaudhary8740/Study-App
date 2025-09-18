import { Router } from "express";
import { asyncHandler } from "../utils/asynchandler.js";
import { createCourse, providerRegistration } from "../controllers/provider.controller.js";

const providerRouter = Router()
providerRouter.route('/upload-course').post(asyncHandler(createCourse))
providerRouter.route('/provider-registration').post(asyncHandler(providerRegistration))
export {providerRouter};