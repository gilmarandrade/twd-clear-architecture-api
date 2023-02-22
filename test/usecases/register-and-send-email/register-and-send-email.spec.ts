import { UserData } from "@/entities"
import { Either, right } from "@/shared"
import { MailServiceError } from "@/usecases/errors/mail-service-error"
import { RegisterAndSendEmail } from "@/usecases/register-and-send-email"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { UserRepository } from "@/usecases/register-user-on-mailing-list/ports"
import { InMemoryUserRepository } from "@/usecases/register-user-on-mailing-list/repository"
import { SendEmail } from "@/usecases/send-email"
import { EmailOptions, EmailService } from "@/usecases/send-email/ports"

const attachmentFilePath = "../resources/test.txt"
const fromName = "Fromname"
const fromEmail = "from@email.com"
const toName = "To name"
const toEmail = "to@email.com"
const subject = "Testando email"
const emailBody = "Hello World"
const emailBodyHtml = "<b>Hello World</b>"
const attachment = [
	{
		filepath: attachmentFilePath,
		contentType: "text/plain"
	}
]

const mailOptions: EmailOptions = {
	host: "test",
	port: 867,
	username: "test",
	password: "test",
	from: fromName + " " + fromEmail,
	to: toName + " <" + toEmail + ">",
	subject: subject,
	text: emailBody,
	html: emailBodyHtml,
	attachment: attachment
}

class MailServiceMock implements EmailService {
    public timesSendWasCalled = 0
    
    async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    	this.timesSendWasCalled++
    	return right(emailOptions)
    }
}

describe("Register user and send email use case", () => {
	test("should add user with complete data to mailing list and send email", async ()=> {
		const users: UserData[] = []
		const repo: UserRepository = new InMemoryUserRepository(users)
		const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
		const mailServiceMock = new MailServiceMock()
		const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)

		const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUseCase)
		const name = "any_name"
		const email = "any@email.com"

		const response: UserData = (await registerAndSendEmailUseCase.perform({ name, email })).value as UserData
		const user = await repo.findUserByEmail("any@email.com")
		expect(user.name).toBe("any_name")
		expect(response.name).toBe("any_name")
		expect(mailServiceMock.timesSendWasCalled).toBe(1)
	})

	test("should not add user neither send email when the email address is invalid", async ()=> {
		const users: UserData[] = []
		const repo: UserRepository = new InMemoryUserRepository(users)
		const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
		const mailServiceMock = new MailServiceMock()
		const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)

		const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUseCase)

		const name = "any_name"
		const email = "invalid_email"

		const response = (await registerAndSendEmailUseCase.perform({ name, email })).value as Error
		expect(response.name).toEqual("InvalidEmailError")
	})

	test("should not add user neither send email when the name is invalid", async ()=> {
		const users: UserData[] = []
		const repo: UserRepository = new InMemoryUserRepository(users)
		const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
		const mailServiceMock = new MailServiceMock()
		const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)

		const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUseCase)

		const name = ""
		const email = "any@email.com"

		const response = (await registerAndSendEmailUseCase.perform({ name, email })).value as Error
		expect(response.name).toEqual("InvalidNameError")
	})
})