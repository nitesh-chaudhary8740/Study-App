import mongoose from "mongoose";
export const connectToDatabase = async() =>{
  try {
    console.log("connecting to DB.....")
    const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    console.log("Connected To DB",connectionInstance.connection.host)
  } catch (error) {
    console.log("Database connection error",error)
    process.exit(1)
  }
  
}