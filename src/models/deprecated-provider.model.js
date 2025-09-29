import mongoose, { Schema } from "mongoose";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";

const providerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    providerUserName: {
      type: String,
      required: true,
      unique: true,
      // index:true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique:true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
      providedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course' // References a new progress model
    }]
  
  },
  { timestamps: true }
);


providerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bycrpt.hash(this.password, 10);
  next();
});
providerSchema.methods.comparePassword = async function (password) {
  return await bycrpt.compare(password, this.password);
};
providerSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
providerSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
export const Provider = mongoose.model("Provider", providerSchema);
