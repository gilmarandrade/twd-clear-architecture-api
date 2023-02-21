import { RegisterUserController } from "@/web-controllers"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { UserRepository } from "@/usecases/register-user-on-mailing-list/ports"
import { InMemoryUserRepository } from "@/usecases/register-user-on-mailing-list/repository"
import { UserData } from "@/entities"

export const makeRegisterUserController = (): RegisterUserController => {
	const userData: UserData[] = []
	const repo: UserRepository = new InMemoryUserRepository(userData)
	const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
	return new RegisterUserController(useCase)
}