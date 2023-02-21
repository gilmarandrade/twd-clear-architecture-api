import express from "express"
import setupMiddleware from "@/main/config/setupMiddleware"
import setupRoute from "@/main/config/routes"

const app = express()

setupMiddleware(app)
setupRoute(app)

export default app