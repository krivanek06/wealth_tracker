import { Field, ObjectType } from '@nestjs/graphql';
import { PersonalAccount as PersonalAccountClient } from '@prisma/client';
import { PersonalAccountTag } from './personal-account-tag.entity';

@ObjectType()
export class PersonalAccount implements PersonalAccountClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => String)
	createdAt: Date;

	@Field(() => String)
	userId: string;

	@Field(() => [PersonalAccountTag])
	personalAccountTag: PersonalAccountTag[];
}
