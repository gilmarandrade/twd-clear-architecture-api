import express from "express"
import setupMiddleware from "@/main/config/setupMiddleware"

const app = express()

setupMiddleware(app)

export default app