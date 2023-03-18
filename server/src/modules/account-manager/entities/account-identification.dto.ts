import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AccountType } from '@prisma/client';

registerEnumType(AccountType, {
	name: 'AccountType',
});

@ObjectType()
export class AccountIdentification {
	@Field(() => ID, {
		nullable: false,
	})
	id: string;

	@Field(() => String, {
		description: 'custom name for account',
		nullable: false,
	})
	name: string;

	@Field(() => String, {
		description: 'Date time when account was created',
		nullable: false,
	})
	createdAt: Date;

	@Field(() => String, {
		description: 'Reference to User.ID who created this account',
		nullable: false,
	})
	userId: string;

	@Field(() => AccountType, {
		description: 'What account types it is',
		nullable: false,
	})
	accountType: AccountType;
}
