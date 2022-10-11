import { IsString, IsUUID } from 'class-validator';

/**
 * execution context property name
 */
export const REQ_USER_PROPERTY = 'REQ_USER';

export enum AUTHENTICATION_PROVIDERS {
	BASIC_AUTH = 'BASIC_AUTH',
	/** gmail authentication  */
	GOOGLE = 'GOOGLE',
}

export class RequestUser {
	@IsUUID()
	id: string;

	@IsString()
	username: string;

	@IsString()
	email: string;

	@IsString()
	authenticationType: AUTHENTICATION_PROVIDERS;
}
