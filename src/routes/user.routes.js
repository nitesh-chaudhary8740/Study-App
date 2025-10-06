import { Router } from "express";
import { currentUser, loginUser, logoutUser, registerAsPublisher, registerUser } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { upload } from "../middlewares/middleware.multer.js";
import { verifyJWT } from "../middlewares/middleware.auth.js";
import { fetchUserCourses, publishCourse } from "../controllers/course.controller.js";
const router = Router()

router.route("/register").post(asyncHandler(registerUser))
router.route("/login").post(asyncHandler(loginUser))
router.route("/update/avatar",upload.fields(
    [
        {
            name:"Avatar",
            maxCount:1
        }
    ]
),)
//secured routes
router.route("/logout").post(verifyJWT,asyncHandler(logoutUser))
router.route("/current-user").get(verifyJWT,asyncHandler(currentUser))
router.route("/publisher-register").post(verifyJWT,asyncHandler(registerAsPublisher))
router.route("/upload-course").post(verifyJWT,asyncHandler(publishCourse))
router.route("/fetch-courses").get(verifyJWT,asyncHandler(fetchUserCourses))


export default router