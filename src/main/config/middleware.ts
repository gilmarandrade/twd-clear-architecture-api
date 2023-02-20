import { Express } from "express"
import { bodyParser } from "@/main/config/middleware/body-parser"
import { cors } from "@/main/config/middleware/cors"

export default (app: Express): void => {
	app.use(cors)
	app.use(bodyParser)
}
