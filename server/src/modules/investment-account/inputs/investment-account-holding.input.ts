import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { InvestmentAccountHoldingHistoryType, InvestmentAccountHoldingType } from '@prisma/client';
import { IsDate, IsInt, Min } from 'class-validator';

// ----------- Other ------------

@InputType()
export class HoldingInputData {
	@Field(() => Int, {
		description: 'How many units of this symbol user has',
	})
	@Min(0)
	@IsInt()
	units: number;

	@Field(() => String, {
		description: 'Date when we added this holding to our investment account',
	})
	@IsDate()
	date: string;
}

// ----------- Create ------------

@InputType()
@ArgsType()
export class InvestmentAccounHoldingCreateInput {
	@Field(() => String, {
		description: 'Symbol ID',
	})
	symbol: string;

	@Field(() => String, {
		description: 'Investment account associated with the asset',
	})
	investmentAccountId: string;

	@Field(() => InvestmentAccountHoldingType)
	holdingType: InvestmentAccountHoldingType;

	@Field(() => InvestmentAccountHoldingHistoryType)
	type: InvestmentAccountHoldingHistoryType;

	@Field(() => HoldingInputData)
	holdingInputData: HoldingInputData;
}

// ----------- Delete ------------

@InputType()
@ArgsType()
export class InvestmentAccounHoldingHistoryDeleteInput {
	@Field(() => String, {
		description: 'Symbol ID',
	})
	symbol: string;

	@Field(() => String, {
		description: 'Investment account associated with the asset',
	})
	investmentAccountId: string;

	@Field(() => String, {
		description: 'Id of the item the user wants to remove',
	})
	itemId: string;
}
