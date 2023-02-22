import { NodeMailerEmailService } from "@/external/mail-services"
import { Either, left, right } from "@/shared"
import { MailServiceError } from "@/usecases/errors/mail-service-error"
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

jest.mock("nodemailer")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require("nodemailer")
const sendMailMock = jest.fn().mockReturnValueOnce("ok")
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe("Nodemailer email service adapter", () => {

	beforeEach(() => {
		sendMailMock.mockClear()
		nodemailer.createTransport.mockClear()
	})

	test("should return ok if email is sent", async () => {
		const nodemailer = new NodeMailerEmailService()
		const result = await nodemailer.send(mailOptions)
		expect(result.value).toEqual(mailOptions)
	})
	test("should return error if email is not sent", async () => {
		const nodemailer = new NodeMailerEmailService()
		sendMailMock.mockImplementationOnce(() => {
			throw new Error()
		})

		const result = await nodemailer.send(mailOptions)
		expect(result.value).toBeInstanceOf(MailServiceError)
	})
})