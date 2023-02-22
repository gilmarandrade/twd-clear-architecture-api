import { UserData } from "@/entities"
import { InvalidEmailError, InvalidNameError } from "@/entities/errors"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { UserRepository } from "@/usecases/register-user-on-mailing-list/ports"
import { RegisterUserAndSendEmailController } from "@/web-controllers"
import { HttpRequest, HttpResponse } from "@/web-controllers/ports"
import { MissingParamError } from "@/web-controllers/erros"
import { InMemoryUserRepository } from "@/usecases/register-user-on-mailing-list/repository"
import { UseCase } from "@/usecases/ports"
import { EmailOptions, EmailService } from "@/usecases/send-email/ports"
import { Either, right } from "@/shared"
import { MailServiceError } from "@/usecases/errors/mail-service-error"
import { SendEmail } from "@/usecases/send-email"
import { RegisterAndSendEmail } from "@/usecases/register-and-send-email"

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

class MailServiceStub implements EmailService {
	async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
		return right(emailOptions)
	}
}

class ErrorThrowingUseCaseStub implements UseCase {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
	perform(request: any): Promise<any> {
		throw new Error("Method not implemented.")
	}
}


describe("Register user web controller", () => {
	const users: UserData[] = []
	const repo: UserRepository = new InMemoryUserRepository(users)
	const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
	const mailServiceStub = new MailServiceStub()
	const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceStub)

	const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUseCase)

	const controller: RegisterUserAndSendEmailController = new RegisterUserAndSendEmailController(registerAndSendEmailUseCase)

	const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()



	test("should return status 200 when request contains valid user data", async () => {
		const request: HttpRequest = {
			body: {
				name: "any name",
				email: "any@email.com"
			}
		}

		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(200)
		expect(respose.body).toEqual(request.body)
	})

	test("should return status 400 when request contains invalid name", async () => {
		const request: HttpRequest = {
			body: {
				name: "a",
				email: "any@email.com"
			}
		}

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

		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(400)
		expect(respose.body).toBeInstanceOf(MissingParamError)
		expect((respose.body as Error).message).toEqual("Missing parameter from request: name, email.")
	})

	test("should return status 500 when server raises", async () => {
		const request: HttpRequest = {
			body: {
				name: "any name",
				email: "any@email.com"
			}
		}

		const controller: RegisterUserAndSendEmailController = new RegisterUserAndSendEmailController(errorThrowingUseCaseStub)
		const respose: HttpResponse = await controller.handle(request)
		expect(respose.statusCode).toEqual(500)
		expect(respose.body).toBeInstanceOf(Error)
	})
})