import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PersonalAccountTag as PersonalAccountTagClient, PersonalAccountTagDataType } from '@prisma/client';

registerEnumType(PersonalAccountTagDataType, {
	name: 'TagDataType',
});

@ObjectType()
export class PersonalAccountTag implements PersonalAccountTagClient {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	createdAt: Date;

	@Field(() => String, {
		description: 'Name of the tag',
	})
	name: string;

	@Field(() => String, {
		description: 'Color of the tag',
	})
	color: string;

	@Field(() => String, {
		description: 'URL to image',
	})
	imageUrl: string;

	@Field(() => PersonalAccountTagDataType)
	type: PersonalAccountTagDataType;

	@Field(() => String, {
		description:
			'Reference to User.id, person who has created this personcal account tag. For detault tags this is null',
		nullable: true,
	})
	userId: string | null;
}
