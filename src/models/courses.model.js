import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema({
  moduleTitle: { type: String, required: true, trim: true },
  moduleDuration: { type: Number, default: 0 }, // minutes
  moduleMedia: { type: String },
  moduleContent: { type: String },
}, { _id: true });

const courseSchema = new Schema({
  courseCode: { type: String, required: true, unique: true, trim: true },
  courseName: { type: String, required: true, trim: true },
  coursePrice: { type: Number, required: true, trim: true },
  courseCategory: { type: String, required: true, trim: true },
  courseCoverImage: { type: String, trim: true },
  coursePublisherName: { type: String, trim: true },
  coursePublisher: { type: mongoose.Schema.Types.ObjectId, ref: "User", trim: true },
  courseModules: [moduleSchema],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  totalPurchases: { type: Number, default: 0 },
}, { timestamps: true });

// Pre-save hook to automatically update totalPurchases
courseSchema.pre("save", function(next) {
  this.totalPurchases = this.students.length;
  next();
});

export const Course = mongoose.model("Course", courseSchema);
export const Module = mongoose.model("Module", moduleSchema);
