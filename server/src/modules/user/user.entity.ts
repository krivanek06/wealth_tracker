import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserClient, UserAuthentication } from '@prisma/client';

@ObjectType()
export class User implements UserClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	createdAt: Date;

	@Field(() => String, {
		nullable: true,
	})
	imageUrl: string | null;

	@Field(() => String)
	username: string;

	@Field(() => String)
	email: string;

	@Field(() => String)
	lastSingInDate: Date;

	authentication: UserAuthentication;
}
