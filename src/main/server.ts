import "module-alias/register"
import { MongoHelper } from "@/external/repositories/mongodb/helper"

// const url = "mongodb://localhost:27017/"
console.log(process.env.MONGO_URL)
MongoHelper.connect(process.env.MONGO_URL)
	.then(async () => {
		const app = (await import("./config/app")).default

		app.listen(process.env.PORT || 5000, () => {
			console.log("Server running at port " + (process.env.PORT || 5000))
		})
	})
	.catch(console.error)