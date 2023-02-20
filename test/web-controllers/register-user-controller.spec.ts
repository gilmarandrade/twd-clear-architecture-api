import { UserData } from "@/entities"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { UserRepository } from "@/usecases/register-user-on-mailing-list/ports"
import { RegisterUserController } from "@/web-controllers"
import { HttpRequest, HttpResponse } from "@/web-controllers/ports"
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
})