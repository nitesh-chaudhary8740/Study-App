import mongoose from "mongoose";

// const userProgressSchema = new Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     courseId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course',
//         required: true
//     },
//     modules: [{
//         moduleId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Module', // References a new Module model
//         },
//         isCompleted: {
//             type: Boolean,
//             default: false
//         }
//     }],
//     purchaseDate: {
//         type: Date,
//         default: Date.now
//     }
// });
const userProgressSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    lastAccessed: {
        type: Date,
        default: Date.now
    }
});
export const UserProgress = mongoose.model("UserProgress",userProgressSchema)
