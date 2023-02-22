import { Either, left, right } from "@/shared"
import { MailServiceError } from "@/usecases/errors/mail-service-error"
import { EmailOptions, EmailService } from "@/usecases/send-email/ports"
import * as nodemailer from "nodemailer"

export class NodeMailerEmailService implements EmailService {
	async send(options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
		try {
			const transporter = nodemailer.createTransport({
				host: options.host,
				port: options.port,
				auth: {
					user: options.username,
					pass: options.password,
				},
				tls: {
					rejectUnauthorized: false
				}
			})
    
			await transporter.sendMail({
				from: options.from,
				to: options.to,
				subject: options.subject,
				text: options.text,
				html: options.html,
				attachments: options.attachment
			})
		} catch(error) {
			console.error(error)
			return left(new MailServiceError)
		}

		return right(options)
	}
    
}