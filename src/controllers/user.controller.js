import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api.error.js";
import { API_Response } from "../utils/api.response.js";

export const registerUser = async (req, res) => {
    console.log("register request received")
  const { fullName, userName, email, password } = req.body;
  console.log(`
    userName:${userName} \n
    fullName:${fullName} \n
    email:${email} \n
    password:${password} \n
    `)
    //field-emptiness checkup
    if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400,"Provide the all requried fields",[
        "fullname","userName","email","password"
    ])
  }

  //check for existing user
  const existingUser = await User.findOne({$or:[{userName},{email}]})
  if(existingUser){
    throw new ApiError(400,"user is alread exist",["this userName or email already might be in use"])
  }
  const registeredUser = await User.create({
    userName,fullName,email,password
  })
  const user = await User.findById(registeredUser._id).select("-password")
  return res.status(200).json(new API_Response(200,user,"user register successfully"))
};

export const loginUser = async (req,res) =>{
    console.log("is code reached here")
    const {email_or_userName,password} = req.body;
    //check for empty fields
    if( !email_or_userName){
        console.log("error in empty")
        throw new ApiError(400,"please provide email or username")
    }
    //check password
    if(!password){
         throw new ApiError(400,"password is required")
    }
    //find user with email or password
    const foundedUser = await User.findOne({$or:[{userName: email_or_userName},{email: email_or_userName}]})
   
    if(!foundedUser){
         throw new ApiError(404,"no user exists with this username or email")
    }
    //if user found then password check
   const isPasswordCorrect = await foundedUser.comparePassword(password)

   if(!isPasswordCorrect){
       console.log(password)
    throw new ApiError(401,"username and password not match please recheck")
   }
   const loggedInUser = await User.findById(foundedUser._id).select("-password")
   res.status(200).json(new API_Response(200,loggedInUser,"user logged in successfully"))
    
}
