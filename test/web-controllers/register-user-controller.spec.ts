import { UserData } from "@/entities"
import { InvalidEmailError, InvalidNameError } from "@/entities/errors"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { UserRepository } from "@/usecases/register-user-on-mailing-list/ports"
import { RegisterUserController } from "@/web-controllers"
import { HttpRequest, HttpResponse } from "@/web-controllers/ports"
import { MissingParamError } from "@/web-controllers/ports/erros"
import { InMemoryUserRepository } from "@test/usecases/register-user-on-mailing-list/repository"

describe("Register user web controller", () => {
	test("should return status 201 when request contains valid user data", async () => {
		const request: HttpRequest = {
			body: {
				name: "any name",
				email: "any@email.com"
			}
		}

		const userData: UserData[] = []
		const userRepo: UserRepository = new InMemoryUserRepository(userData)
		const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(userRepo)
		const controller: RegisterUserController = new RegisterUserController(usecase)

		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(201)
		expect(respose.body).toEqual(request.body)
	})

	test("should return status 400 when request contains invalid name", async () => {
		const request: HttpRequest = {
			body: {
				name: "a",
				email: "any@email.com"
			}
		}

		const userData: UserData[] = []
		const userRepo: UserRepository = new InMemoryUserRepository(userData)
		const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(userRepo)
		const controller: RegisterUserController = new RegisterUserController(usecase)

		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(400)
		expect(respose.body).toBeInstanceOf(InvalidNameError)
	})

	test("should return status 400 when request contains invalid email", async () => {
		const request: HttpRequest = {
			body: {
				name: "any_name",
				email: "invalidemail.com"
			}
		}

		const userData: UserData[] = []
		const userRepo: UserRepository = new InMemoryUserRepository(userData)
		const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(userRepo)
		const controller: RegisterUserController = new RegisterUserController(usecase)

		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(400)
		expect(respose.body).toBeInstanceOf(InvalidEmailError)
	})

	test("should return status 400 when request is missing name", async () => {
		const request: HttpRequest = {
			body: {
				email: "any@email.com"
			}
		}

		const userData: UserData[] = []
		const userRepo: UserRepository = new InMemoryUserRepository(userData)
		const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(userRepo)
		const controller: RegisterUserController = new RegisterUserController(usecase)

		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(400)
		expect(respose.body).toBeInstanceOf(MissingParamError)
		expect((respose.body as Error).message).toEqual("Missing parameter from request: name.")
	})

	test("should return status 400 when request is missing email", async () => {
		const request: HttpRequest = {
			body: {
				name: "any_name",
			}
		}

		const userData: UserData[] = []
		const userRepo: UserRepository = new InMemoryUserRepository(userData)
		const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(userRepo)
		const controller: RegisterUserController = new RegisterUserController(usecase)

		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(400)
		expect(respose.body).toBeInstanceOf(MissingParamError)
		expect((respose.body as Error).message).toEqual("Missing parameter from request: email.")
	})

	test("should return status 400 when request is missing all params", async () => {
		const request: HttpRequest = {
			body: {
			}
		}

		const userData: UserData[] = []
		const userRepo: UserRepository = new InMemoryUserRepository(userData)
		const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(userRepo)
		const controller: RegisterUserController = new RegisterUserController(usecase)

		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(400)
		expect(respose.body).toBeInstanceOf(MissingParamError)
		expect((respose.body as Error).message).toEqual("Missing parameter from request: name, email.")
	})
})