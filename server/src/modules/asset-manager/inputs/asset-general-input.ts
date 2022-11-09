import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class AssetGeneralSearchInput {
	@Field(() => String)
	@MaxLength(10)
	symbolPrefix: string;

	@Field(() => Boolean, {
		defaultValue: false,
	})
	isCrypto: boolean;
}
