import { User, UserData } from "@/entities"
import { InvalidNameError, InvalidEmailError } from "@/entities/errors"
import { Either, left, right } from "@/shared"
import { UseCase } from "@/usecases/ports"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { SendEmail } from "@/usecases/send-email"
import { MailServiceError } from "../errors/mail-service-error"

export class RegisterAndSendEmail implements UseCase {
    private registerUserOnMailingListUseCase: RegisterUserOnMailingList
    private sendEmailUseCase: SendEmail

    constructor(registerUsecase: RegisterUserOnMailingList, sendEmailUseCase: SendEmail) {
    	this.registerUserOnMailingListUseCase = registerUsecase
    	this.sendEmailUseCase = sendEmailUseCase
    }

    async perform(request: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, User>> {
    	const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)
    	if(userOrError.isLeft()) {
    		return left(userOrError.value)
    	}

    	const user: User = userOrError.value
    	const userData: UserData = {
    		name: user.name.value,
    		email: user.email.value,
    	}

    	await this.registerUserOnMailingListUseCase.perform(userData)
    	const result = await this.sendEmailUseCase.perform(userData)

    	if(result.isLeft()) {
    		return left(result.value)
    	}
    	return right(user)
    }

}