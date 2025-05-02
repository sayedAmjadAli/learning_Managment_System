import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import hpp from "hpp"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import cors from "cors"
import { FRONTEND_ORIGIN, NODE_ENV, PORT } from "./config/env.js"
import { AppError, handleError } from "./middleware/error.middleware.js"
import dbConnection from "./config/dbConnection.js"
dotenv.config({ path: "./.env" })



const app = express()

//mongodb Connection

dbConnection()



//rate limiter

const limiter = rateLimit({
    windowMs: 10 * 1000 * 60,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
})

//parsebody

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:false,limit:"16kb"}))

//security packages

app.use(hpp())
app.use(helmet())
app.use("/api",limiter)



if(NODE_ENV==="development"){
   app.use(morgan(":method :url :status :response-time ms"))
}


app.use(
    cors(
        {
            credentials: true,
            origin: FRONTEND_ORIGIN,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
            allowedHeaders: [
              "Content-Type",
              "Authorization",
              "X-Requested-With",
              "device-remember-token",
              "Access-Control-Allow-Origin",
              "Origin",
              "Accept",
            ],
        }
    )
)






//import routes here

import healthcheckRoute from "./route/health.route.js"
import userRoute from "./route/user.route.js"

//use routes here

app.use("/api/health",healthcheckRoute)
app.use("/api/user",userRoute)


//handle 404 route
app.use((req, res) => {
    throw new AppError(404,"This route does not exists")
})

//handle global error

app.use(handleError)


app.listen(PORT, () => {
    console.log(`Server is running on PORT :${PORT}`)
})



