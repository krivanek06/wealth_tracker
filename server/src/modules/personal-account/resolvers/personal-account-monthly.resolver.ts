import { Inject, UseGuards } from '@nestjs/common';
import { Float, Int, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PubSubEngine } from 'graphql-subscriptions';
import { Input } from 'src/graphql';
import { CREATED_MONTHLY_DATA } from '../dto';
import { PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountMonthlyService } from '../services';
import { AuthorizationGuard, RequestUser, ReqUser } from './../../../auth';
import { PUB_SUB } from './../../../graphql/graphql.types';

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

	/* Subscriptions */

	@Subscription(() => PersonalAccountMonthlyData)
	createdMonthlyData() {
		return this.pubSub.asyncIterator(CREATED_MONTHLY_DATA);
	}
}
