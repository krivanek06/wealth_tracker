import { ArgsType, Field, Float, InputType } from '@nestjs/graphql';
import { InvestmentAccountCashChangeType } from '@prisma/client';
import { Min } from 'class-validator';

@InputType()
@ArgsType()
export class InvestmentAccountCashCreateInput {
	@Field(() => Float)
	@Min(0)
	cashValue: number;

	@Field(() => String, {
		description: 'What date to associate cash account change',
	})
	date: string;

	@Field(() => InvestmentAccountCashChangeType)
	type: InvestmentAccountCashChangeType;
}

// ----------- Edit ------------

@InputType()
@ArgsType()
export class InvestmentAccountCashEditInput {
	@Field(() => String, {
		description: 'If value is assigned, it will change existing cash value or create a new entry',
	})
	itemId: string;

	@Field(() => Float)
	@Min(0)
	cashCurrent: number;

	@Field(() => String, {
		description: 'What date to associate cash account change',
	})
	date: string;
}

// ----------- Delete ------------

@InputType()
@ArgsType()
export class InvestmentAccountCashDeleteInput {
	@Field(() => String, {
		description: 'If value is assigned, it will change existing cash value or create a new entry',
	})
	itemId: string;
}
