import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserClient } from '@prisma/client';

@ObjectType()
export class User implements UserClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	createdAt: Date;

	@Field(() => String)
	imageUrl: string;

	@Field(() => String)
	username: string;

	@Field(() => String)
	email: string;

	@Field(() => String)
	lastSingInDate: Date;
}
