import { UserAccountType } from '@prisma/client';
import { IsString } from 'class-validator';

/**
 * execution context property name
 */
export const REQ_USER_PROPERTY = 'REQ_USER';

export interface RequestUserInt {
	id: string;
	username: string;
	email: string;
	role: UserAccountType;
}

export class RequestUser {
	@IsString()
	id: string;

	@IsString()
	username: string;

	@IsString()
	email: string;

	@IsString()
	role: UserAccountType;

	constructor(data: RequestUserInt) {
		this.id = data.id;
		this.username = data.username;
		this.email = data.email;
		this.role = data.role;
	}
}
