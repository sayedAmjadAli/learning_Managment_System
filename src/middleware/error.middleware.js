import { NODE_ENV } from "../config/env.js"

class AppError extends Error {
    constructor(statusCode, message) {
        super(message)

        this.message = message
        this.status = `${statusCode}`.startsWith(4) ? "fail" : "error"
        this.statusCode = statusCode
        this.operational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

export { AppError }


export const catchAsync = function (fun) {
    return (req, res, next) => {
        fun(req, res, next).catch(next)
    }
}


export const handleError = (error, req, res, next) => {
    error.status = error.status || "error"
    error.statusCode = error.statusCode || 500

    if (NODE_ENV === "development") {
        //send error with stack

        res
            .status(error.statusCode)
            .json(
                {
                    status: error.status,
                    message: error.message,
                    error: error,
                    stack: error.stack
                }
            )
    } else {

        //now check that error is operational 

        if (error.operational) {
            res
                .status(error.statusCode)
                .json(
                    {
                        status: error.status,
                        message: error.message,

                    }
                )
        } else {

            console.log("Error:", error)
            res
                .status(500)
                .json(
                    {
                        status: "error",
                        message: "something went wrong",

                    }
                )
        }
    }

}


//handle mongoDb Specific Errors
export const handleMongodbErrors = (err) => {

    if (err.name === "CastError") {
        return new AppError(400, `Invalid ${err.path} :${err.value}`)
    }

    if (err.code === 11000) {
        const value = err?.errmsg?.match(/(["'])(\\?.)*?\1/)[0] || "unknown";
        return new AppError(400, `Duplicate Field value ${value}. Please user another value!`)
    }

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(el => el.message);
        return new AppError(400, `Invalid input data ${errors.join('. ')}`)
    }


    if (err.name === 'MongoNetworkError') {
        return new AppError(500, 'Database connection error. Please try again later.');
    }

    return err
}


export const handleJwtError = () => {
    return new AppError(400, "Invalid Token ,Please log in Again!")
}

export const handleJWTExpiredError = (er) => {
    return new AppError(400, "Token Expired , Please log in Again!")
}