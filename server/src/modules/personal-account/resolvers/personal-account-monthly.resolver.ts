import { UseGuards } from '@nestjs/common';
import { Float, Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountMonthlyService } from '../services';
import { AuthorizationGuard } from './../../../auth';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountMonthlyData)
export class PersonalAccountMonthlyResolver {
	constructor(private personalAccountMonthlyService: PersonalAccountMonthlyService) {}

	/* Resolvers */

	@ResolveField('dailyEntries', () => Int)
	getMonthlyDataDailyEntries(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): number {
		return personalAccountMonthlyData.dailyData.length;
	}

	@ResolveField('monthlyIncome', () => Float)
	async getMonthlyIncome(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): Promise<number> {
		const dailyData = await this.personalAccountMonthlyService.getMonthlyIncomeOrExpense(
			personalAccountMonthlyData,
			PersonalAccountTagDataType.INCOME
		);
		// calculate total sum
		return dailyData.reduce((a, b) => a + b.value, 0);
	}

	@ResolveField('monthlyExpense', () => Float)
	async getMonthlyExpense(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): Promise<number> {
		const dailyData = await this.personalAccountMonthlyService.getMonthlyIncomeOrExpense(
			personalAccountMonthlyData,
			PersonalAccountTagDataType.EXPENSE
		);
		// calculate total sum
		return dailyData.reduce((a, b) => a + b.value, 0);
	}
}
