import { Field, ObjectType } from '@nestjs/graphql';
import { PersonalAccountTag as PersonalAccountTagClient, PersonalAccountTagDataType } from '@prisma/client';

@ObjectType()
export class PersonalAccountTag implements PersonalAccountTagClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	createdAt: Date;

	@Field(() => String)
	modifiedAt: Date;

	@Field(() => String, {
		description: 'Name of the tag',
	})
	name: string;

	@Field(() => PersonalAccountTagDataType)
	type: PersonalAccountTagDataType;

	@Field(() => String, {
		defaultValue: false,
		description: 'True only for default Tags, shared accross every user',
	})
	isDefault: boolean;

	@Field(() => String, {
		description:
			'Reference to User.id, person who has created this personcal account tag. For detault tags this is null',
		nullable: true,
	})
	userId: string | null;

	@Field(() => String, {
		nullable: true,
		description:
			'Reference to PersonalAccount.id, if this tag is specific for some personal account. For detault tags this is null',
	})
	personalAccountId: string | null;
}
