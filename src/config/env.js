import dotenv from "dotenv"


dotenv.config({ path: "./.env" })

const PORT = process.env.PORT
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN
const NODE_ENV = process.env.NODE_ENV


export {
    PORT,
    FRONTEND_ORIGIN,
    NODE_ENV
}