import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

export enum InvestmentAccountTransactionInputOrderType {
	ORDER_BY_DATE = 'ORDER_BY_DATE',
	ORDER_BY_CREATED_AT = 'ORDER_BY_CREATED_AT',
	ORDER_BY_VALUE = 'ORDER_BY_BEST_VALUE',
	ORDER_BY_VALUE_CHANGE = 'ORDER_BY_BEST_VALUE_CHANGE',
}

registerEnumType(InvestmentAccountTransactionInputOrderType, {
	name: 'InvestmentAccountTransactionInputOrderType',
});

@InputType()
export class InvestmentAccountTransactionInput {
	@Field(() => Int, {
		defaultValue: 0,
	})
	@Min(0)
	@IsInt()
	offset: number;

	@Field(() => Boolean, {
		defaultValue: true,
		description: 'Put false to order DESC',
	})
	orderAsc: boolean;

	@Field(() => Boolean, {
		defaultValue: true,
		description: 'Put false if only SELL operation to get',
	})
	includeBuyOperation: boolean;

	@Field(() => InvestmentAccountTransactionInputOrderType, {
		defaultValue: InvestmentAccountTransactionInputOrderType.ORDER_BY_DATE,
	})
	orderType: InvestmentAccountTransactionInputOrderType;

	@Field(() => [String], {
		defaultValue: [],
		description: 'Include symbols IDs for filtering, if empty, show all',
	})
	filterSymbols: string[];
}
