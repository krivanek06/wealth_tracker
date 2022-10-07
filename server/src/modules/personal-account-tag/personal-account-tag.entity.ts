import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	PersonalAccountTag as PersonalAccountTagClient,
	PersonalAccountTagData as PersonalAccountTagDataClient,
	PersonalAccountTagDataType,
} from '@prisma/client';

@ObjectType()
class PersonalAccountTagData implements PersonalAccountTagDataClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => String)
	createdAt: Date;

	@Field(() => String)
	modifiedAt: Date;

	@Field(() => PersonalAccountTagDataType)
	type: PersonalAccountTagDataType;

	@Field(() => String, {
		nullable: true,
	})
	accountSpecific: string | null;
}

@ObjectType()
export class PersonalAccountTag implements PersonalAccountTagClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	modifiedAt: Date;

	@Field(() => Int)
	total: number;

	@Field(() => [PersonalAccountTagData])
	data: PersonalAccountTagData[];

	@Field(() => Boolean, {
		defaultValue: false,
	})
	isDefault: boolean;

	@Field(() => String, {
		defaultValue: null,
	})
	userId: string | null;
}
