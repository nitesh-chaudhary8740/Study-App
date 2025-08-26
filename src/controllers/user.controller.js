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
    
}
