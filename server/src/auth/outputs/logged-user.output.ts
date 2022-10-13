import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './../../modules/user';

@ObjectType()
export class LoggedUserOutput {
	@Field(() => String, { description: "Generated user's accessToken, encoded RequestUser" })
	accessToken: string;

	@Field(() => User, { description: 'Return the authenticated user object' })
	user: User;
}
