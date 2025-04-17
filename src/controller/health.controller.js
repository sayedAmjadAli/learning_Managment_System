
import { getDbStatus } from "../config/dbConnection.js"


const healthcheck = (req, res) => {

    try {
        const dbStatus = getDbStatus()

        const health = {
            status: "OK",
            timestamp: new Date().toISOString,
            services: {
                database: {
                    status: dbStatus.isConnected ? "healthy" : "unhealthy",
                    details: {
                        ...dbStatus,
                        ReadyStateText: getReadyStateText(dbStatus.readyState)
                    }
                },
                server: {
                    status: "healthy",
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage()
                }
            }
        }

        const httpStatus = health.services.database.status === "healthy" ? 200 : 503
        
        res.
            status(httpStatus)
            .json(health)

    } catch (error) {
        console.log("health check error occur", error)

        res
            .status(500)
            .json(
                {
                    status: "Error",
                    timestamp: new Date().toISOString,
                    message: error.message
                }
            )
    }


}


const getReadyStateText = (readyState) => {
    switch (readyState) {
        case 0: return "disconnected"
        case 1: return "connected"
        case 2: return "connecting"
        case 3: return "disconnecting"
        default: return "unknown"
    }
}

export { healthcheck }