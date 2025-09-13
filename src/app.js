import { configDotenv } from "dotenv"
configDotenv()
import cors from "cors"
import cookieParser from "cookie-parser"

import express from "express"

const app = express()
import router from "./routes/user.routes.js"
console.log("this is cors",process.env.CORS_ORIGIN)
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    // origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use('/user',router)
export default app

//experiments



// const anotherRouter = express.Router() 
// anotherRouter.route('/').get((req,res)=>{ //babe router can't be access with app instance and use method?? 
//     res.send("hello from user 1")
// })
// app.use('/',anotherRouter)
// app.route('/user2').get((req,res)=>{
//     res.send("hello from user2")
// })