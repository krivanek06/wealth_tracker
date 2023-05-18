import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
	AuthenticationType,
	UserAccountType,
	UserAuthentication as UserAuthenticationClient,
	User as UserClient,
} from '@prisma/client';

registerEnumType(AuthenticationType, {
	name: 'AuthenticationType',
});

registerEnumType(UserAccountType, {
	name: 'UserAccountType',
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

	@Field(() => String, {
		nullable: true,
	})
	personalAccountId: string | null;

	@Field(() => String, {
		nullable: true,
	})
	investmentAccountId: string | null;

	@Field(() => UserAccountType)
	accountType: UserAccountType;
}
