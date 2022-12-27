import { Injectable } from '@nestjs/common';
import SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
	private readonly senderEmail: string = process.env.SENDGRID_EMAIL_ADDRESS;

	constructor() {
		SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
	}

	async send(mail: SendGrid.MailDataRequired) {
		const transport = await SendGrid.send(mail);

		console.log(`Email successfully dispatched to ${mail.to}`);
		return transport;
	}
}
