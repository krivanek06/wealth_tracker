import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountPortfolioSnapshot } from '../entities';

@ObjectType()
export class InvestmentAccountDeleteOutput {
	@Field(() => String)
	id: string;

	@Field(() => String, {
		description: 'custom name for personal account',
	})
	name: string;

	@Field(() => Float, {
		description: 'How much cash on hand is on this investment account',
	})
	cashCurrent: number;

	@Field(() => InvestmentAccountPortfolioSnapshot, {
		nullable: true,
		description: 'Last inserted data in InvestmentAccountHistory.portfolioSnapshots',
	})
	lastPortfolioSnapshot: InvestmentAccountPortfolioSnapshot | null;

	@Field(() => String, {
		description: 'Reference to User.ID who created this investment account',
	})
	userId: string;
}
