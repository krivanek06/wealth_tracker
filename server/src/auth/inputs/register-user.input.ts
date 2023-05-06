import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
	@Field(() => String)
	@MinLength(6)
	@MaxLength(100)
	@IsEmail()
	email: string;

	@Field(() => String)
	@MinLength(6)
	@MaxLength(40)
	password: string;

	@Field(() => String)
	@MinLength(6)
	@MaxLength(40)
	passwordRepeat: string;
}
