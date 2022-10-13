import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoggedUserOutput {
	@Field(() => String, { description: "Generated user's accessToken" })
	accessToken: string;
}
