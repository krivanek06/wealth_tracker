import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

export enum AUTHENTICATION_PROVIDERS {
	BASIC_AUTH = 'BASIC_AUTH',
	/** gmail authentication  */
	GOOGLE = 'GOOGLE',
}

registerEnumType(AUTHENTICATION_PROVIDERS, {
	name: 'AUTHENTICATION_PROVIDERS',
});

@InputType()
export class LoginSocialInput {
	@Field(() => String)
	@MaxLength(500)
	@MinLength(6)
	accessToken: string;

	@Field(() => AUTHENTICATION_PROVIDERS)
	provider: AUTHENTICATION_PROVIDERS;
}
