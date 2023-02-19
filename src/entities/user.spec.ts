import { left } from "../shared/Either"
import { InvalidEmailError } from "./errors/invalid-email-error"
import InvalidNameError from "./errors/invalid-name-error"
import {User} from "./user"

describe("User domain entity", () => {
	test("should not create user with invalid email address", () => {
		const invalid_email = "invalid_email"
		const error = User.create({ name: "any_name", email: invalid_email})
		expect(error).toEqual(left(new InvalidEmailError()))
	})

	test("should not create user with invalid name (too few caracters)", () => {
		const invalid_name = "n                  "
		const error = User.create({ name: invalid_name, email: "valid@email.com"})
		expect(error).toEqual(left(new InvalidNameError()))
	})

	test("should not create user with invalid name (too many caracters)", () => {
		const invalid_name = "n".repeat(257)
		const error = User.create({ name: invalid_name, email: "valid@email.com"})
		expect(error).toEqual(left(new InvalidNameError()))
	})

	test("should create user with valid data", () => {
		const valid_name = "any_name"
		const valid_email = "valid@email.com"
		const user: User = User.create({ name: valid_name, email: valid_email}).value as User
		expect(user.name.value).toEqual(valid_name)
		expect(user.email.value).toEqual(valid_email)
	})
})