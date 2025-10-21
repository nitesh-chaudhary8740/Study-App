import mongoose, { Schema } from "mongoose";

// ----- Module Schema -----
const moduleSchema = new Schema({
  moduleTitle: { type: String, required: true, trim: true },
  moduleDuration: { type: Number, default: 0 }, // in minutes
  moduleFile: { type: String, trim: true }, //this is now will store media
  moduleFileType: { type: String, enum: ["video", "raw"], required: true },
  moduleOrder:{ type: Number,},
}, { _id: true });

// ----- Review Schema -----
const reviewSchema = new Schema({
  feedback: { type: String, required: true, trim: true },
  rating: { type: Number, min: 1, max: 5 }, // optional: if you want ratings
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

// ----- Course Schema -----
const courseSchema = new Schema({
  courseCode: { type: String, required: true, unique: true, trim: true },
  courseName: { type: String, required: true, trim: true },
  coursePrice: { type: Number, required: true },
  courseCategory: { type: String, required: true, trim: true },
  courseCoverImage: { type: String, trim: true },
  coursePublisherName: { type: String, trim: true },
  coursePublisher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // ----- Course Progress -----
  courseModules: [moduleSchema],

  // ----- Engagement -----
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  courseLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  courseReviews: [reviewSchema],

  // ----- Analytics -----
  totalPurchases: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

// ----- Hooks -----
// Update totalPurchases automatically

courseSchema.pre("save", function(next) {
  this.totalPurchases = this.students.length;
  this.totalLikes = this.courseLikes.length;

  // Recalculate average rating
  if (this.courseReviews.length > 0) {
    const avg = this.courseReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / this.courseReviews.length;
    this.averageRating = Math.round(avg * 10) / 10; // round to 1 decimal
  } else {
    this.averageRating = 0;
  }

  next();
});

export const Course = mongoose.model("Course", courseSchema);
export const Module = mongoose.model("Module", moduleSchema);
