import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import hpp from "hpp"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import cors from "cors"
import { FRONTEND_ORIGIN, NODE_ENV, PORT } from "./config/env.js"

dotenv.config({ path: "./.env" })



const app = express()

//rate limiter

const limiter = rateLimit({
    windowMs: 10 * 1000 * 60,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
})



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




//handle 404 route
app.use((req, res) => {
    res.status(404).json({ succes: false, message: "This route does not exists" })
})


app.listen(PORT, () => {
    console.log(`Server is running on PORT :${PORT}`)
})



