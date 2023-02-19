import { UserData } from "../../../entities/user-data"
import { InMemoryUserRepository } from "./in-memory-user-repository"

describe("In memory User repository", () => {
	test("should return null if user is not found", async () => {
		const users: UserData[] = []
		const sut = new InMemoryUserRepository(users)
		const user = await sut.findUserByEmail("any@email.com")
		expect(user).toBeNull()
	})
	test("should return user if user is found", async () => {
		const users: UserData[] = []
		const sut = new InMemoryUserRepository(users)
		const name = "any_name"
		const email = "any@email.com"
		await sut.add({name, email})
		const user = await sut.findUserByEmail("any@email.com")
		expect(user.name).toBe("any_name")
	})

	test("should return all users", async () => {
		const users: UserData[] = [
			{ name: "any_name", email: "any@email.com" },
			{ name: "second_name", email: "any@email.com" },
		]
		const sut = new InMemoryUserRepository(users)
		const returnedUsers = await sut.findAllUsers()
		expect(returnedUsers.length).toBe(2)

	})
})