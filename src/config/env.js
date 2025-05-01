import dotenv from "dotenv"


dotenv.config({ path: "./.env" })

const PORT = process.env.PORT
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN
const NODE_ENV = process.env.NODE_ENV

const MONGODB_URI = process.env.MONGODB_URI




const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET


const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN





export {
    PORT,
    FRONTEND_ORIGIN,
    NODE_ENV,
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN
}