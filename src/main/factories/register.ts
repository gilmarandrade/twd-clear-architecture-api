import { RegisterUserAndSendEmailController } from "@/web-controllers"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { UserRepository } from "@/usecases/register-user-on-mailing-list/ports"
import { MongodbUserRepository } from "@/external/repositories/mongodb"
import { SendEmail } from "@/usecases/send-email"
import { EmailService } from "@/usecases/send-email/ports"
import { NodeMailerEmailService } from "@/external/mail-services"
import { getEmailOptions } from "../config/email"
import { RegisterAndSendEmail } from "@/usecases/register-and-send-email"

export const makeRegisterUserAndSendEmailController = (): RegisterUserAndSendEmailController => {
	const repo: UserRepository = new MongodbUserRepository()
	const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

	const emailService: EmailService = new NodeMailerEmailService()
	const sendEmailUseCase: SendEmail = new SendEmail(getEmailOptions(), emailService)

	const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
	return new RegisterUserAndSendEmailController(registerAndSendEmailUseCase)
}