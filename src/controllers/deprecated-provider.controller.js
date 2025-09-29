// import { Course } from "../models/courses.model.js";

// import { ApiError } from "../utils/api.error.js";
// import { customAlphabet } from "nanoid";
// import { API_Response } from "../utils/api.response.js";
// import { Provider } from "../models/provider.model.js";
// import { json } from "express";
// const generateAccessAndRefreshTokenForProvider = async(providerId) =>{
// try {
//     const provider = await Provider.findById(providerId);
//     const accessToken =  await provider.generateAccessToken()
//     const refreshToken = await provider.generateRefreshToken()
//     provider.refreshToken = refreshToken;
//     await provider.save({validateBeforeSave:false})
//     return {accessToken,refreshToken}
// } catch (error) {
//   console.log("Token Generation Error",error)
//   throw new ApiError(500,"error in generating the token")
// }
// }


// //provider SignUp
// export const providerRegistration = async (req,res) =>{
//   const {providerUserName,fullName,email,password} = req.body
//   console.log("provider",providerUserName)
//   console.log(fullName)
//   console.log(email)
//   console.log(password)

//   //find empty fields
//   if([providerUserName,fullName,email,password].some(field=>field?.trim()===""))
//   {
//     throw new ApiError(400,"please provide the all requried feilds",[providerUserName.trim(),fullName.trim(),email.trim(),password.trim()])
//   }
//   //check if username or email exists
//   const existedProvider = await Provider.findOne({$or:[{email},{providerUserName}]})
//   if(existedProvider){
//     throw new ApiError (400,"this username or email already exists")
//   }
//   const createdProvider = await Provider.create(
//     {
//       providerUserName,
//       email,
//       fullName,
//       password
//     }
//   )
//   const providerResData = await Provider.findById(createdProvider._id).select("-password -refreshToken")
//   res.status(200).json(new API_Response(200,providerResData,"new provider registered successfully"))
// }
// //provider SignIn
// export const providerSignIn = async(req,res) =>{
//   console.log("provider sign in invoked")
//   const {providerUserName_or_email,password} = req.body
//   if(!providerUserName_or_email.trim()){
//     throw new ApiError(400,"provide the username or email")
//   }
//   if(!password.trim()){
//     throw new ApiError(400,"password is required")
//   }
//   const foundedProvider = await Provider.findOne({$or:[{providerUserName:providerUserName_or_email},{email:providerUserName_or_email}]})
//   console.log(foundedProvider)
//   if(!foundedProvider){
//     throw new ApiError(401,"provider with this email or username does not exist")
//   }
//   console.log("hellow",foundedProvider.password)
//   const isPasswordCorrect = await foundedProvider.comparePassword(password)
//   if(!isPasswordCorrect){
//     throw new ApiError(401,"password does not match")
//   }
//   const {accessToken,refreshToken} = await generateAccessAndRefreshTokenForProvider(foundedProvider._id)
//   const cookieOptions = {
//     httpOnly:true,
//     secure:true
//   }
//   const loggedInUser  = await Provider.findById(foundedProvider._id).select("-password -refreshToken")
//   res.status(200)
//   .cookie("providerAccessToken",accessToken,cookieOptions)
//   .cookie("providerRefreshToken",refreshToken,cookieOptions)
//   .json(new API_Response(200,loggedInUser,"User Logged In successFully"))
// } 
// //current-provider
// export const currentProvider = async(req,res) =>{
//   res.status(200).json(new API_Response(200,req.provider,"current logged in provider fetched successfully"))
// }
// export const providerLogout = async(req,res)=>{
//    await Provider.findByIdAndUpdate(req.provider._id,{$set:{refreshToken:undefined}},{new:true})
//    res.status(200)
//    .clearCookie("providerAccessToken")
//    .clearCookie("providerRefreshToken")
//    .json(new API_Response(200,{},"provider loggedout successfully"))

// }
// //provider tasks functions

// export const createCourse = async (req, res) => {
//   const { courseName, coursePrice, courseProvider } = req.body;
//   if (
//     [courseName, coursePrice, courseProvider].some((field) => field?.trim() === "")
//   ) {
//     throw new ApiError(400, "all fields are required for posting the course");
//   }
//   const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

//   const uniqueCourseCode = nanoid();

//   const newCourse = await Course.create({
//     courseCode: uniqueCourseCode,
//     courseName,
//     coursePrice:Number(coursePrice),
//     courseProvider,
//   });
  
//   res
//     .status(200)
//     .json(
//       new API_Response(
//         200,
//         newCourse,
//         "your new course has been created! successfully"
//       )
//     );
// }

// ;
