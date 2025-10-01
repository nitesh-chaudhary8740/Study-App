import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api.error.js";
import { API_Response } from "../utils/api.response.js";
import { validators } from "../utils/string.validation.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    console.log("generating...");
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();

    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //its avoid the kickin of the models
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};

export const registerUser = async (req, res) => {
  
  console.log("register request received");
  const { fullName, userName, email, password } = req.body;
  console.log(`
    userName:${userName} \n
    fullName:${fullName} \n
    email:${email} \n
    password:${password} \n
    `);
  //field-emptiness checkup

  if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Provide the all requried fields", [
      "fullname",
      "userName",
      "email",
      "password",
    ]);
  }
  //validations
  if(!(validators.userName(userName))){
    throw new ApiError(400,"not valid username")
  }
  if(!(validators.name(fullName))){
    throw new ApiError(400,"not valid name")
  }
  if(!(validators.email(email))){
    throw new ApiError(400,"not valid email")
  }
  if(!(validators.password(password))){
    throw new ApiError(400,"not valid password")
  }
  //check for existing user
  const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existingUser) {
    throw new ApiError(400, "user is alread exist", [
      "this userName or email already might be in use",
    ]);
  }
  const registeredUser = await User.create({
    userName:validators.noExtraSpaces(userName).trim(),
    fullName:validators.noExtraSpaces(fullName).trim(),
    email:validators.noExtraSpaces(email).trim(),
    password:password.trim()
  });
  const user = await User.findById(registeredUser._id).select("-password");
  return res
    .status(200)
    .json(new API_Response(200, user, "user register successfully"));
};

export const loginUser = async (req, res) => {
  try {
    console.log("is code reached here");
    const { email_or_userName, password } = req.body;
    //check for empty fields
    if (!email_or_userName) {
      console.log("error in empty");
      throw new ApiError(400, "please provide email or username");
    }
    //check password
    if (!password) {
      throw new ApiError(400, "password is required");
    }
    //find user with email or password
    const foundedUser = await User.findOne({
      $or: [{ userName: email_or_userName }, { email: email_or_userName }],
    });

    if (!foundedUser) {
      throw new ApiError(404, "no user exists with this username or email");
    }
    //if user found then password check
    const isPasswordCorrect = await foundedUser.comparePassword(password);

    if (!isPasswordCorrect) {
      console.log(password);
      throw new ApiError(401, "username and password not match please recheck");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      foundedUser._id
    );
    console.log(accessToken, refreshToken);
    const loggedInUser = await User.findById(foundedUser._id).select(
      "-password -refreshToken"
    );
    console.log(loggedInUser);

    //cookies options
    const options = {
      httpOnly: true,
      secure: true,
    };
    console.log("it about to send res");
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new API_Response(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "logged in successfully"
        )
      );
  } catch (error) {
    console.log("login error", error);
    throw new ApiError(500, "error in login user");
  }
};

/**
 *
 * these are the secured routes
 */

export const logoutUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, //new true returns the updated document of db
    }
  );
  console.log("logouted", user);
  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log("code is okay before sending res");
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new API_Response(200, {}, "user logout successfully"));
};
//to fetch if user loggedIN
export const currentUser = async (req, res) => {
  return res
    .status(200)
    .json(new API_Response(200, req.user, "user fetched successfully"));
};
// to signUp as instructor
export const registerAsPublisher = async(req,res) =>{
  if(req.user.isPublisher){
     throw new ApiError (400,"current user already has registered as an publisher") 
  }
  req.user.isPublisher = true;
 const updatedUser =  await req.user.save({validateBeforeSave:false})
 res.status(200).json(new API_Response(200,updatedUser,"user registered as publisher successfully"))

}
