import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { upload } from "../middlewares/middleware.multer.js";
const router = Router()

router.route("/register").post(asyncHandler(registerUser))
router.route("/update/avatar",upload.fields(
    [
        {
            name:"Avatar",
            maxCount:1
        }
    ]
),)

export default router