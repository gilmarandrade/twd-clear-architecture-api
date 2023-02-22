import { EmailOptions } from "@/usecases/send-email/ports"

const attachment = [
	{
		filename: "clean-architecture.pdf",
		path: "https://otaviolemos.github.io/clean-architecture.pdf"
	}
]


export function getEmailOptions(): EmailOptions {
	const mailOptions: EmailOptions = {
		host: process.env.EMAIL_HOST,
		port: Number.parseInt(process.env.EMAIL_PORT),
		username: process.env.EMAIL_USERNAME,
		password: process.env.EMAIL_PASSWORD,
		from: "gilmar <gilmar-andrade@gmail.com>",
		to: "",
		subject: "Mensagem de teste",
		text: "texto da mensagem",
		html: "<b>texto da mensagem</b>",
		attachment: attachment
	}

	return mailOptions
}