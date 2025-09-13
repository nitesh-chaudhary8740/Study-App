
import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema({
    moduleTitle: {
        type: String,
        required: true,
        trim: true
    },
    moduleDuration: {
        type: Number,
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
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    coursePrice: {
        type: Number,
        required: true
    },
    courseProvider: {
        type: String,
        required: true,
        trim: true
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
