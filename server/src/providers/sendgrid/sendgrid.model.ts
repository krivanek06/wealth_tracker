import SendGrid from '@sendgrid/mail';
import { SENDGRID_EMAIL_ADDRESS } from '../../environments';

export class MailConstructor {
	static readonly senderEmail: string = SENDGRID_EMAIL_ADDRESS;

	static changedPasswordEmail(email: string, password: string): SendGrid.MailDataRequired {
		const mail = {
			to: email,
			subject: 'Changed password',
			from: MailConstructor.senderEmail,
			html: `
				<h1>You password has been changed</h1>
				<div>Your current password is: ${password}</div>
			`,
		};

		return mail;
	}
}
