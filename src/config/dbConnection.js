import mongoose, { modelNames } from "mongoose"
import { MONGODB_URI, NODE_ENV } from "./env.js"

const RETRY_INTERVAL = 5000
const MAX_RETRIES = 3

class Database {

    constructor() {
        this.retryCount
        this.isConnected

        mongoose.set("strictQuery", true)

        //mongodb events

        mongoose.connection.on("connected", () => {
            console.log(`Mongodb Connected Successfully`)
            this.isConnected = true
        })

        mongoose.connection.on("disconnected", () => {
            console.log("Mongodb disconnected ")
            this.isConnected = false
            this.handleDisconnected()
         })

        mongoose.connection.on("error", (err) => {
            console.log("Mongodb Connection Error", err)
            this.isConnected = false
        })



    }

    async connect() {
        try {

            const options = {
                family: 4,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000
            }

            if (NODE_ENV === "development") {
                mongoose.set("debug", true)
            }

            await mongoose.connect(`${MONGODB_URI}/copylms`, options)
       
        } catch (error) {
            console.log("MongoDb failed to connect ", error.message)
            this.handleConnectionError()
        }
    }

    async handleConnectionError() {
        if (this.retryCount < MAX_RETRIES) {
            this.retryCount++
            console.log(`Retry Attempt....to connect Mongodb count ${this.retryCount} from ${MAX_RETRIES}`)
            await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL))

            return this.connect()
        } else {
            console.log(`MongoDb failed to connect from ${MAX_RETRIES}`)
            process.exit(0)
        }
    }


    handleDisconnected() {
        if (!this.isConnected) {
            console.log("Attempting to retry mongodb connection")
            this.connect()
        }
    }

    async handleAppTermination(){
        try {
            console.log("Closing Mongodb connection through app termination")
            await mongoose.connection.close()
            process.exit(0)
        } catch (error) {
            console.log("Error occur while terminating application")
            process.exit(1)
        }
    }
    getMongodbState() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        }
    }

}

const dbConnection = new Database()
export default dbConnection.connect.bind(dbConnection)

export const getDbStatus = dbConnection.getMongodbState.bind(dbConnection)