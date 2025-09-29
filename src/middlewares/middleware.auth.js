import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/api.error.js"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req,_,next) => {
try {
    const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ","")
    if(!token){
        console.log("does it happen")
        throw new ApiError(401,"unauthorized Token")
    }
    const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    if(!user) {
        throw new ApiError(401,"Invalid Access Token")
    }
    req.user = user;
    console.log(" token verified")
    next()
} catch (error) {
    throw new ApiError(401,error?.message||"invaled access token")
}
})