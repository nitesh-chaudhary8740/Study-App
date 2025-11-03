import { configDotenv } from "dotenv";
configDotenv();
import { connectToDatabase } from "./db/db-connection.js";
import app from "./app.js";


const StartApp = async() => {
 const HOST = '0.0.0.0';
    await connectToDatabase();
    app.listen(process.env.PORT,HOST,()=>{
        console.log("Server is listening",)
    })
}
StartApp();
