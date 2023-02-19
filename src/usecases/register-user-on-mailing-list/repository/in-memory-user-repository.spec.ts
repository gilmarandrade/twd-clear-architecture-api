import { UserData } from "../user-data"
import { InMemoryUserRepository } from "./in-memory-user-repository"

describe("In memory User repository", () => {
	test("should return null if user is not found", async () => {
		const users: UserData[] = []
		const userRepo = new InMemoryUserRepository(users)
		const user = await userRepo.findUserByEmail("any@email.com")
		expect(user).toBeNull()
	})
	test("should return user if user is found", async () => {
		const users: UserData[] = []
		const userRepo = new InMemoryUserRepository(users)
		const name = "any_name"
		const email = "any@email.com"
		await userRepo.add({name, email})
		const user = await userRepo.findUserByEmail("any@email.com")
		expect(user.name).toBe("any_name")
	})
})