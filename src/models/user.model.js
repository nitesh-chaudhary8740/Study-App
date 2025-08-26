import mongoose, { Schema } from "mongoose";
import bycrpt from "bcrypt"

const userSchema = new Schema({
    fullName:{
        type:String,
        required: true,
        trim:true,
    },
    userName:{
        type:String,
        required: true,
        unique:true,
        // index:true,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        required :true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    coverImage:{
        type:String
    },
    courses: [
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        }
    }
]
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bycrpt.hash(this.password,10)
    next;
})
export const User = mongoose.model("User",userSchema)
