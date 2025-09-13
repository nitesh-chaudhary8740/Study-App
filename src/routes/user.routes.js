import { Router } from "express";
import { currentUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { upload } from "../middlewares/middleware.multer.js";
import { verifyJWT } from "../middlewares/middleware.auth.js";
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
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/current-user").get(verifyJWT,currentUser)

export default router