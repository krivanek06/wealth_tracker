import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
	@Field()
	@MinLength(6)
	@MaxLength(100)
	@IsEmail()
	email: string;

	@Field()
	@MinLength(6)
	@MaxLength(40)
	password: string;

	@Field()
	@MinLength(6)
	@MaxLength(40)
	passwordRepeat: string;
}
