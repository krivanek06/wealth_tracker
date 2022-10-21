import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { PersonalAccount, PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountCreateInput, PersonalAccountEditInput } from '../inputs';
import { PersonalAccountAggregationDataOutput, PersonalAccountWeeklyAggregationOutput } from '../outputs';
import {
	PersonalAccounDataAggregatorService,
	PersonalAccountMonthlyService,
	PersonalAccountService,
} from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccount)
export class PersonalAccountResolver {
	constructor(
		private personalAccountService: PersonalAccountService,
		private personalAccountMonthlyService: PersonalAccountMonthlyService,
		private personalAccounDataAggregatorService: PersonalAccounDataAggregatorService
	) {}

	/* Queries */

	@Query(() => [PersonalAccount], {
		description: 'Returns all personal accounts for the requester',
		defaultValue: [],
	})
	getPersonalAccounts(@ReqUser() authUser: RequestUser): Promise<PersonalAccount[]> {
		return this.personalAccountService.getPersonalAccounts(authUser.id);
	}

	/* Mutation */
	@Mutation(() => PersonalAccount)
	createPersonalAccount(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountCreateInput
	): Promise<PersonalAccount> {
		return this.personalAccountService.createPersonalAccount(input, authUser.id);
	}

	@Mutation(() => PersonalAccount)
	editPersonalAccount(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountEditInput
	): Promise<PersonalAccount> {
		return this.personalAccountService.editPersonalAccount(input, authUser.id);
	}

	@Mutation(() => PersonalAccount)
	deletePersonalAccount(
		@ReqUser() authUser: RequestUser,
		@Input() personalAccountId: string
	): Promise<PersonalAccount> {
		return this.personalAccountService.deletePersonalAccount(personalAccountId, authUser.id);
	}

	/* Resolvers */

	@ResolveField('monthlyData', () => [PersonalAccountMonthlyData])
	getMonthlyData(@Parent() personalAccount: PersonalAccount): Promise<PersonalAccountMonthlyData[]> {
		return this.personalAccountMonthlyService.getMonthlyDataByAccountId(personalAccount);
	}

	@ResolveField('weeklyAggregaton', () => [PersonalAccountWeeklyAggregationOutput])
	getAllWeeklyAggregatedData(
		@Parent() personalAccount: PersonalAccount
	): Promise<PersonalAccountWeeklyAggregationOutput[]> {
		return this.personalAccounDataAggregatorService.getAllWeeklyAggregatedData(personalAccount);
	}

	@ResolveField('yearlyAggregaton', () => [PersonalAccountAggregationDataOutput])
	getAllYearlyAggregatedData(
		@Parent() personalAccount: PersonalAccount
	): Promise<PersonalAccountAggregationDataOutput[]> {
		return this.personalAccounDataAggregatorService.getAllYearlyAggregatedData(personalAccount);
	}
}
