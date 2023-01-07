import { Inject, UseGuards } from '@nestjs/common';
import { Float, Int, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PubSubEngine } from 'graphql-subscriptions';
import { Input } from 'src/graphql';
import { PUB_SUB } from '../../../graphql/graphql.types';
import { CREATED_MONTHLY_DATA } from '../dto';
import { PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountDailyDataOutput } from '../outputs';
import { PersonalAccountMonthlyService } from '../services';
import { AuthorizationGuard, RequestUser, ReqUser } from './../../../auth';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountMonthlyData)
export class PersonalAccountMonthlyResolver {
	constructor(
		private personalAccountMonthlyService: PersonalAccountMonthlyService,
		@Inject(PUB_SUB) private pubSub: PubSubEngine
	) {}

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

	@ResolveField('dailyIncomes', () => [PersonalAccountDailyDataOutput])
	getMonthlyDataDailyIncomes(
		@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData
	): Promise<PersonalAccountDailyDataOutput[]> {
		return this.personalAccountMonthlyService.getMonthlyIncomeOrExpense(
			personalAccountMonthlyData,
			PersonalAccountTagDataType.INCOME
		);
	}

	@ResolveField('dailyExpenses', () => [PersonalAccountDailyDataOutput])
	getMonthlyDataDailyExpenses(
		@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData
	): Promise<PersonalAccountDailyDataOutput[]> {
		return this.personalAccountMonthlyService.getMonthlyIncomeOrExpense(
			personalAccountMonthlyData,
			PersonalAccountTagDataType.EXPENSE
		);
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

	/* Subscriptions */

	@Subscription(() => PersonalAccountMonthlyData)
	createdMonthlyData() {
		return this.pubSub.asyncIterator(CREATED_MONTHLY_DATA);
	}
}
