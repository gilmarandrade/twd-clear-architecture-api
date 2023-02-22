import { RegisterUserAndSendEmailController } from "@/web-controllers"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { UserRepository } from "@/usecases/register-user-on-mailing-list/ports"
import { MongodbUserRepository } from "@/external/repositories/mongodb"

export const makeRegisterUserController = (): RegisterUserAndSendEmailController => {
	const repo: UserRepository = new MongodbUserRepository()
	const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
	return new RegisterUserAndSendEmailController(useCase)
}