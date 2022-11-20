import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class InvestmentAccountTransactionInput {
	@Field(() => String)
	accountId: string;

	@Field(() => Int)
	@Min(0)
	@IsInt()
	offset: number;

	@Field(() => Boolean, {
		defaultValue: true,
	})
	orderByDate: boolean;

	@Field(() => Boolean, {
		defaultValue: false,
	})
	orderByCreatedAt: boolean;
}
