import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsUrl, MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class UserCreate {
	@Field(() => String)
	@MaxLength(150)
	@IsUrl()
	imageUrl: string;

	@Field(() => String)
	@MaxLength(50)
	username: string;

	@Field(() => String)
	@IsEmail()
	email: string;
}
