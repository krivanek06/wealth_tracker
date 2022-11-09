import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class InvestmentAccountGrowthInput {
	@Field(() => String)
	investmenAccountId: string;

	@Field(() => [String], {
		description: 'Sectors which to filter by. If empty, no filtering',
		defaultValue: [],
		nullable: true,
	})
	sectors: string[];
}
