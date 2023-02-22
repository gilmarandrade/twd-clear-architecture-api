import { Either, left, right } from "@/shared"
import { MailServiceError } from "@/usecases/errors/mail-service-error"
import { SendEmail } from "@/usecases/send-email"
import { User } from "@/entities"
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

class MailServiceErrorStub implements EmailService {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
		return left(new MailServiceError())
	}
}

class MailServiceStub implements EmailService {
	async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
		return right(emailOptions)
	}
}

describe("Send email to user", () => {
	test("shoud email user with valid name and email address", async () => {
		const mailServiceStub = new MailServiceStub()
		const useCase = new SendEmail(mailOptions, mailServiceStub)

		const name = toName
		const email = toEmail
		const user: User = User.create({ name, email }).value as User

		const response = (await useCase.perform(user)).value as EmailOptions
		expect(response.to).toEqual(mailOptions.to)
	})

	
	test("should return error when email service fail", async () => {
		const mailServiceErrorStub = new MailServiceErrorStub()
		const useCase = new SendEmail(mailOptions, mailServiceErrorStub)

		const name = toName
		const email = toEmail
		const user: User = User.create({ name, email }).value as User

		const response = await useCase.perform(user)
		expect(response.value).toBeInstanceOf(MailServiceError)

	})
})