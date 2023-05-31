import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export enum AUTHENTICATION_PROVIDERS {
	BASIC_AUTH = 'BASIC_AUTH',
	/** gmail authentication  */
	GOOGLE = 'GOOGLE',
}

registerEnumType(AUTHENTICATION_PROVIDERS, {
	name: 'AUTHENTICATION_PROVIDERS',
});

@InputType()
export class LoginSocialInputClient {
	@Field(() => String)
	@MaxLength(500)
	@MinLength(6)
	accessToken: string;

	@Field(() => AUTHENTICATION_PROVIDERS)
	provider: AUTHENTICATION_PROVIDERS;

	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => Boolean)
	verified_email: boolean;

	@Field(() => String)
	name: string;

	@Field(() => String, {
		nullable: true,
	})
	locale: string | null;

	@Field(() => String)
	picture: string;
}
