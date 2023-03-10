import { MongoClient, Collection } from "mongodb"

export const MongoHelper = {
	client: null as MongoClient,
	async connect(uri: string): Promise<void> {
		this.client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifyedTopology: true,
		})
	},
	async disconnect(): Promise<void> {
		this.client.close()
	},
	getCollection(name: string): Collection {
		return this.client.db("twd-clean-architecture").collection(name)
	},
	async clearCollection(name: string): Promise<void> {
		this.client.db("twd-clean-architecture").collection(name).deleteMany({})
	}
    
}