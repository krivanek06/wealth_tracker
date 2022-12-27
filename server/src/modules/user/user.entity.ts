import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AuthenticationType, User as UserClient, UserAuthentication as UserAuthenticationClient } from '@prisma/client';

registerEnumType(AuthenticationType, {
	name: 'AuthenticationType',
});

@ObjectType()
export class UserAuthentication implements UserAuthenticationClient {
	@Field(() => AuthenticationType)
	authenticationType: AuthenticationType;
	token: string;
	password: string;
}

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

	@Field(() => UserAuthentication)
	authentication: UserAuthentication;
}
