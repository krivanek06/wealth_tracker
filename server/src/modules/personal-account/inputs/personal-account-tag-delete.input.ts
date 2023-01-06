import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountTagDataDelete {
	@Field(() => String, {
		description: 'tag id',
	})
	@MaxLength(100)
	id: string;

	@Field(() => String)
	@MaxLength(100)
	personalAccountId: string;
}
