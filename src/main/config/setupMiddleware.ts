import { Express } from "express"
import { bodyParser, contentType, cors } from "@/main/config/middleware"

export default (app: Express): void => {
	app.use(cors)
	app.use(bodyParser)
	app.use(contentType)
}