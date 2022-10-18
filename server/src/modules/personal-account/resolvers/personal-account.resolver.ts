import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { PersonalAccount, PersonalAccountMonthlyData, PersonalAccountWeeklyAggregation } from '../entities';
import { PersonalAccountCreateInput, PersonalAccountEditInput } from '../inputs';
import { PersonalAccountMonthlyService, PersonalAccountService, PersonalAccountWeeklyService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccount)
export class PersonalAccountResolver {
	constructor(
		private personalAccountService: PersonalAccountService,
		private personalAccountMonthlyService: PersonalAccountMonthlyService,
		private personalAccountWeeklyService: PersonalAccountWeeklyService
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

	@ResolveField('weeklyAggregatonByTag', () => [PersonalAccountWeeklyAggregation])
	getAllWeeklyAggregatedData(@Parent() personalAccount: PersonalAccount): Promise<PersonalAccountWeeklyAggregation[]> {
		return this.personalAccountWeeklyService.getAllWeeklyAggregatedData(personalAccount);
	}
}
