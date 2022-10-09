import { Field } from '@nestjs/graphql';
import { IsEmail, MaxLength } from 'class-validator';
import { AUTHENTICATION_PROVIDERS } from './authentication.constants';

export class AuthenticationBasicAuth {
	@Field(() => String)
	@MaxLength(50)
	@IsEmail()
	email: string;

	@Field(() => String)
	password: string;
}

export class AuthenticationBasicAuthRegistration {
	@IsEmail()
	@MaxLength(50)
	@Field(() => String)
	email: string;

	@Field(() => String)
	password: string;

	@Field(() => String)
	passwordRepeat: string;
}

export class AuthenticationProvider {
	@Field(() => String)
	provider: AUTHENTICATION_PROVIDERS;

	@Field(() => String)
	@MaxLength(400)
	token: string;
}
