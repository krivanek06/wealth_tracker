import { IsString } from 'class-validator';

/**
 * execution context property name
 */
export const REQ_USER_PROPERTY = 'REQ_USER';

export interface RequestUserInt {
	id: string;
	username: string;
	email: string;
	role: string;
}

export class RequestUser {
	@IsString()
	id: string;

	@IsString()
	username: string;

	@IsString()
	email: string;

	@IsString()
	role: string;

	constructor(data: RequestUserInt) {
		this.id = data.id;
		this.username = data.username;
		this.email = data.email;
		this.role = data.role;
	}
}
