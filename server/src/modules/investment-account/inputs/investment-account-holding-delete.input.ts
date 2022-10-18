import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class InvestmentAccounHoldingDeleteInput {
	@Field(() => String, {
		description: 'Symbol ID',
	})
	symbol: string;

	@Field(() => String, {
		description: 'Investment account from which we will remove the symbol',
	})
	investmentAccountId: string;
}
