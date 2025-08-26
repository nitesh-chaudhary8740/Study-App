import mongoose, { Schema } from "mongoose";
const courseSchema = new Schema({
    courseName:{
        type:String,
        required:true,
        trim:true

    },
    coursePrice:{
        type:Number,
        required:true,
        trim:true
    },
    courseProvider:{
        type:String,
        required:true,
        trim:true
    },
})
export const Course = mongoose.model("Cousre",courseSchema)