import { configDotenv } from "dotenv";
configDotenv();
import { connectToDatabase } from "./db/db-connection.js";
import app from "./app.js";


const StartApp = async() => {
 
    await connectToDatabase();
    app.listen(process.env.PORT,()=>{
        console.log("Server is listening",)
    })
}
StartApp();
