import { Either, Right, right } from "@/shared"
import { MailServiceError } from "@/usecases/errors/mail-service-error"
import { EmailOptions, EmailService } from "@/usecases/send-email/ports"
import { SendEmail } from "@/usecases/send-email"

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

describe("Send email to user", () => {
	test("shoud email user with valid name and email address", async () => {
		const mailServiceStub = new MailServiceStub()
		const useCase = new SendEmail(mailOptions, mailServiceStub)
		const response = await useCase.perform({ name: toName, email: toEmail})
		expect(response).toBeInstanceOf(Right)
	})
})