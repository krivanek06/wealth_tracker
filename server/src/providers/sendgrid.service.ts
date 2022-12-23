import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
	private readonly senderEmail: string = process.env.SENDGRID_EMAIL_ADDRESS;

	constructor(private readonly configService: ConfigService) {
		SendGrid.setApiKey(this.configService.get<string>(process.env.SENDGRID_API_KEY));
	}

	async send(mail: SendGrid.MailDataRequired) {
		const transport = await SendGrid.send(mail);

		console.log(`Email successfully dispatched to ${mail.to}`);
		return transport;
	}

	createResetPasswordEmail = (email: string, password: string): SendGrid.MailDataRequired => {
		const mail = {
			to: email,
			subject: 'Reset password',
			from: this.senderEmail,
			html: `
                <h1>You password has been reset</h1>
                <div>Your current password is: ${password}</div>
            `,
		};

		return mail;
	};
}
