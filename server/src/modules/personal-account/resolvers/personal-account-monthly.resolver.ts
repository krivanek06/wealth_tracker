import { UseGuards } from '@nestjs/common';
import { Float, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PersonalAccountTagDataType } from '@prisma/client';
import { Input } from 'src/graphql';
import { PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountMonthlyDataSeach } from '../inputs';
import { PersonalAccountMonthlyService } from '../services';
import { AuthorizationGuard } from './../../../auth';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountMonthlyData)
export class PersonalAccountMonthlyResolver {
	constructor(private personalAccountMonthlyService: PersonalAccountMonthlyService) {}

	@Query(() => PersonalAccountMonthlyData, {
		description: 'Returns monthly data by id',
		defaultValue: [],
	})
	getPersonalAccountMonthlyDataById(
		@Input() monthlyDataSearch: PersonalAccountMonthlyDataSeach
	): Promise<PersonalAccountMonthlyData> {
		return this.personalAccountMonthlyService.getMonthlyDataById(
			monthlyDataSearch.id,
			monthlyDataSearch.personalAccountId
		);
	}

	/* Resolvers */

	@ResolveField('dailyEntries', () => Int)
	getMonthlyDataDailyEntries(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): number {
		return personalAccountMonthlyData.dailyData.length;
	}

	@ResolveField('monthlyIncome', () => Float)
	getMonthlyIncome(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): Promise<number> {
		return this.personalAccountMonthlyService.getMonthlyIncomeOrExpense(
			personalAccountMonthlyData,
			PersonalAccountTagDataType.INCOME
		);
	}

	@ResolveField('monthlyExpense', () => Float)
	getMonthlyExpense(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): Promise<number> {
		return this.personalAccountMonthlyService.getMonthlyIncomeOrExpense(
			personalAccountMonthlyData,
			PersonalAccountTagDataType.EXPENSE
		);
	}
}
