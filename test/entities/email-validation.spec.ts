import { Email } from "@/entities"

describe("Email validation", () => {
	test("should not accept null strings", () => {
		const email = null
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should not accept empty strings", () => {
		const email = ""
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should accept valid email", () => {
		const email = "any@email.com"
		expect(Email.validate(email)).toBeTruthy()
	})

	test("should not accept local part larger than 64 chars", () => {
		const email = "l".repeat(65) + "@gamil.com"
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should not accept domain part larger than 255 chars", () => {
		const email = "local@" + "d".repeat(128) + "." + "d".repeat(127)
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should not accept string larger than 320 chars", () => {
		const email = "l".repeat(64) + "@" + "d".repeat(128) + "." + "d".repeat(127)
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should not accept empty local part", () => {
		const email = "@email.com"
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should not accept empty domain", () => {
		const email = "any@"
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should not accept domain with parts larger than 63 charts", () => {
		const email = "any@" + "d".repeat(64) + ".com" 
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should not accept local part with invalid char", () => {
		const email = "any email@email.com"
		expect(Email.validate(email)).toBeFalsy()
	})

	test("should not accept email without @", () => {
		const email = "anyemailemail.com"
		expect(Email.validate(email)).toBeFalsy()
	})

})