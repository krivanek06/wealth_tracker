import { ArgsType, Field, Float, InputType } from '@nestjs/graphql';
import { InvestmentAccountHoldingHistoryType } from '@prisma/client';
import { IsDate, IsNumber, Min } from 'class-validator';

// ----------- Other ------------

@InputType()
export class HoldingInputData {
	@Field(() => Float, {
		description: 'How many units of this symbol user has',
	})
	@Min(0)
	@IsNumber()
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

	@Field(() => Boolean)
	isCrypto: boolean;

	@Field(() => InvestmentAccountHoldingHistoryType)
	type: InvestmentAccountHoldingHistoryType;

	@Field(() => HoldingInputData)
	holdingInputData: HoldingInputData;

	@Field(() => Float, {
		description: 'User can add custom total value of this holding and not load from API',
		nullable: true,
	})
	customTotalValue?: number;
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
		description: 'Id of the item the user wants to remove',
	})
	itemId: string;
}
