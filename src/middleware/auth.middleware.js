import { JWT_SECRET } from "../config/env.js";
import { User } from "../models/user.model.js";
import { AppError, catchAsync, handleJwtError, handleJWTExpiredError } from "./error.middleware.js";
import jwt from "jsonwebtoken"


const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token || req.headers("Authorization").replace("Bearer ", "")

    if (!token) {
        return AppError(401, "You are not logged in ! Please login to get access")
    }


    try {

        const decoded = await jwt.verify(token, JWT_SECRET)
        req._id = decoded._id

        //find user with this userid

        const user=await User.findById(decoded._id)

        if(!user){
            return AppError(404,"User not found")
        }


        req.user=user

        next()
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return handleJwtError()
        }

        if (error.name === "TokenExpiredError") {
            return handleJWTExpiredError()
        }
    }
}

const restrictTo = (...roles) => {
    return catchAsync((req, res) => {
        if (!roles.includes(req.user.role)) {
            return AppError(401, "You are not allowed to access this")
        }
    })
}


const optionalAuth = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers("Authorization").replace("Bearer ")
        if (token) {
            const decoded = await jwt.verify(token, JWT_SECRET)
            req._id = decoded._id
        }

        next()
    } catch (error) {
        next()
    }
}


export {
    isAuthenticated,
    restrictTo,
    optionalAuth
}