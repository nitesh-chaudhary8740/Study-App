
import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema({
    moduleTitle: {
        type: String,
        required: true,
        trim: true
    },
    moduleDuration: {
        type: Number, //in minutes
        default: 0
    },
    moduleMedia: {
        type: String // URL of pdf, text, or video
    },
    moduleContent: {
        type: String // reading text
    }
}, { _id: true }); // _id:true is the default, but it's good practice to be explicit.

const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    coursePrice: {
        type: Number,
         trim:true,
        required: true
    },
    courseCategory:{
        type:String,
        required:true,
        trim:true
    },
    courseCoverImage:{
        type:String,
        trim:true
    },
    coursePublisherName:{
        type:String,
         trim:true
    },
    coursePublisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
         trim:true
    },
    courseModules: [moduleSchema] // Referencing the subdocument schema
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);
export const Module = mongoose.model("Module", moduleSchema);
// const courseSchema = new Schema({
//     courseName:{
//         type:String,
//         required:true,
//         trim:true

//     },
//     coursePrice:{
//         type:Number,
//         required:true,
//         trim:true
//     },
//     courseProvider:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     courseModules:[
//         {
//             _id:{
//                 type:mongoose.Schema.Types.ObjectId
//             },   
//             moduleTitle:{
//                 Type:String,
//             },
//             moduleDuration:{
//                 Type:Number
//             },
//             moduleMedia:{
//                 Type:String //url of pdf, text, or video
//             },
//             moduleContent:{
//                 Type:String //reading text
//             }
//         }
//     ]
// })
