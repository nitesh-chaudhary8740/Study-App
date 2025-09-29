// import { Router } from "express";
// import { asyncHandler } from "../utils/asynchandler.js";
// import { createCourse, currentProvider, providerLogout, providerRegistration, providerSignIn } from "../controllers/provider.controller.js";
// import { verifyProviderJWT } from "../middlewares/middleware.provider.auth.js";

// const providerRouter = Router()
// providerRouter.route('/upload-course').post(asyncHandler(createCourse))
// providerRouter.route('/provider-registration').post(asyncHandler(providerRegistration))
// providerRouter.route('/provider-login').post(asyncHandler(providerSignIn))
// //secure routes
// providerRouter.route('/current-provider').get(verifyProviderJWT,asyncHandler(currentProvider))
// providerRouter.route('/provider-logout').get(verifyProviderJWT,asyncHandler(providerLogout))
// export {providerRouter};