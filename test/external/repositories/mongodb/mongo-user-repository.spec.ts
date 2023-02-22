import { MongodbUserRepository } from "@/external/repositories/mongodb"
import { MongoHelper } from "@/external/repositories/mongodb/helper"

describe("Mongodb User repository", () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	beforeEach(async () => {
		await MongoHelper.clearCollection("users")
	})

	test("when user is added it should exists", async () => {
		const userRepository = new MongodbUserRepository()
		const user = {
			name: "any name",
			email: "any@email.com"
		}

		await userRepository.add(user)

		expect(await userRepository.exists(user)).toBeTruthy()
	})

	test("find all users should return all users", async () => {
		const userRepository = new MongodbUserRepository()

		await userRepository.add({
			name: "any name 1",
			email: "any1@email.com"
		})
		await userRepository.add({
			name: "any name 2",
			email: "any2@email.com"
		})

		const users = await userRepository.findAllUsers()

		expect(users[0].name).toEqual("any name 1")
		expect(users[1].name).toEqual("any name 2")
	})
})