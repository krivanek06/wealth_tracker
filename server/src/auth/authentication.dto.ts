import { IsString } from 'class-validator';

/**
 * execution context property name
 */
export const REQ_USER_PROPERTY = 'REQ_USER';

export class RequestUser {
	@IsString()
	id: string;

	@IsString()
	username: string;

	@IsString()
	email: string;

	constructor(data: { id: string; username: string; email: string }) {
		this.id = data.id;
		this.username = data.username;
		this.email = data.email;
	}
}
