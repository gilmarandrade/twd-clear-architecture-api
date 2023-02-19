import { left } from "../shared/Either"
import { InvalidEmailError } from "./errors/invalid-email-error"
import User from "./user"

describe("User domain entity", () => {
	test("should not create user with invalid email address", () => {
		const invalid_email = "invalid_email"
		const error = User.create({ name: "any_name", email: invalid_email})
		expect(error).toEqual(left(new InvalidEmailError()))
	})
})