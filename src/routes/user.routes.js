import { Router } from "express";
import { currentUser, loginUser, logoutUser, registerAsPublisher, registerUser } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { upload } from "../middlewares/middleware.multer.js";
import { verifyJWT } from "../middlewares/middleware.auth.js";
import { deleteModule, fetchCourseById, fetchUserCourses, publishCourse, SSEConnection, uploadCourseCoverImage, uploadModule } from "../controllers/course.controller.js";
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


// ***************** course related routes *****************

router.route("/upload-course").post(verifyJWT,asyncHandler(publishCourse))
router.route("/fetch-courses").get(verifyJWT,asyncHandler(fetchUserCourses))
router.route("/manage-course/:courseId").get(verifyJWT,asyncHandler(fetchCourseById))
//coverImage upload
router.route("/manage-course/update-image/:courseId").post(verifyJWT,upload.fields([
    {
        name:"coverImage",
        maxCount:1
    }
]),asyncHandler(uploadCourseCoverImage))
router.route("/manage-course/:courseId/add-module").post(verifyJWT,upload.fields([
    {
        name:"moduleFile",
        maxCount:1
    }
]),asyncHandler(uploadModule))
router.route("/manage-course/:courseId/sse/upload-status/:uploadId").get(asyncHandler(SSEConnection))
router.route("/manage-course/:courseId/delete-module/:moduleId").delete(verifyJWT,asyncHandler(deleteModule))


export default router