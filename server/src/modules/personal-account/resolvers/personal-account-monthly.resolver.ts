import { UseGuards } from '@nestjs/common';
import { Float, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PersonalAccountTagDataType } from '@prisma/client';
import { Input } from 'src/graphql';
import { PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountMonthlyService } from '../services';
import { AuthorizationGuard, RequestUser, ReqUser } from './../../../auth';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountMonthlyData)
export class PersonalAccountMonthlyResolver {
	constructor(private personalAccountMonthlyService: PersonalAccountMonthlyService) {}

	@Query(() => PersonalAccountMonthlyData, {
		description: 'Returns monthly data by id',
		defaultValue: [],
	})
	getPersonalAccountMonthlyDataById(
		@ReqUser() authUser: RequestUser,
		@Input() monthlyDataId: string
	): Promise<PersonalAccountMonthlyData> {
		return this.personalAccountMonthlyService.getMonthlyDataById(monthlyDataId, authUser.id);
	}

	/* Resolvers */

	@ResolveField('dailyEntries', () => Int)
	getMonthlyDataDailyEntries(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): number {
		return personalAccountMonthlyData.dailyData.length;
	}

	@ResolveField('monthlyIncome', () => Float)
	getMonthlyIncome(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): number {
		return this.personalAccountMonthlyService.getMonthlyIncomeOrExpense(
			personalAccountMonthlyData,
			PersonalAccountTagDataType.INCOME
		);
	}

	@ResolveField('monthlyExpense', () => Float)
	getMonthlyExpense(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): number {
		return this.personalAccountMonthlyService.getMonthlyIncomeOrExpense(
			personalAccountMonthlyData,
			PersonalAccountTagDataType.EXPENSE
		);
	}
}
