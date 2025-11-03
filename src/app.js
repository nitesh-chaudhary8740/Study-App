import { configDotenv } from "dotenv"
configDotenv()
import cors from "cors"
import cookieParser from "cookie-parser"

import express from "express"

const app = express()
import router from "./routes/user.routes.js"
// import {  providerRouter } from "./routes/provider.routes.js"
console.log("this is cors",process.env.CORS_ORIGIN)
const allowedOrigins = [
    // 1. Local access (for development on your PC)
    'http://localhost:5173', 
    
    // 2. Network access (for your phone) - MUST use the IP address
    'http://10.226.10.129:5173', 
];

const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // This is why 'origin: *' failed!
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
};
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use('/user',router)
// app.use('/provider',providerRouter)
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