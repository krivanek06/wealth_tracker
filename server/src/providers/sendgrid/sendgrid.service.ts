import { Injectable } from '@nestjs/common';
import SendGrid from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../../environments';

@Injectable()
export class SendGridService {
	constructor() {
		SendGrid.setApiKey(SENDGRID_API_KEY);
	}

	async send(mail: SendGrid.MailDataRequired) {
		const transport = await SendGrid.send(mail);

		console.log(`Email successfully dispatched to ${mail.to}`);
		return transport;
	}
}
