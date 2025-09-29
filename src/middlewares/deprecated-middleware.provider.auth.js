// import { Provider } from "../models/provider.model.js";
// import { ApiError } from "../utils/api.error.js";
// import { asyncHandler } from "../utils/asynchandler.js";
// import jwt from "jsonwebtoken"

// export const verifyProviderJWT = asyncHandler(async(req,_,next) => {
//       try {
//           const token = req.cookies?.providerAccessToken;
//           console.log(token)
         
//           if(!token){
//             console.log("is this executed")
//               throw new ApiError(401,"Provider Access Token not avaible")
//           }
//           const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      
//           if(!decodedToken){
//                 throw new ApiError(401,"unauthorized provider token")
//           }
//           const provider = await Provider.findById(decodedToken._id).select("-password -refreshToken")
//              if (!provider) {
//                 throw new ApiError(401, "Invalid access token of provider");
//       }
//           req.provider = provider;
//           next()
//       } catch (error) {
//         console.log("error in provider token verification")
//         throw new ApiError(error.statusCode || 500, error.msg||"Error in verification of the token")
//       }
// })

