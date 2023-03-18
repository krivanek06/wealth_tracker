import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { PersonalAccount, PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountCreateInput, PersonalAccountEditInput } from '../inputs';
import { PersonalAccountAggregationDataOutput, PersonalAccountWeeklyAggregationOutput } from '../outputs';
import {
	PersonalAccountDataAggregatorService,
	PersonalAccountMonthlyService,
	PersonalAccountService,
} from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccount)
export class PersonalAccountResolver {
	constructor(
		private personalAccountService: PersonalAccountService,
		private personalAccountMonthlyService: PersonalAccountMonthlyService,
		private personalAccountDataAggregatorService: PersonalAccountDataAggregatorService
	) {}

	/* Queries */
	@Query(() => PersonalAccount, {
		description: 'Returns personal accounts for authenticated user',
		nullable: true,
	})
	getPersonalAccountByUser(@ReqUser() authUser: RequestUser): Promise<PersonalAccount | undefined> {
		return this.personalAccountService.getPersonalAccountByUserId(authUser.id);
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
		return this.personalAccountMonthlyService.getMonthlyDataByAccountId(personalAccount.id);
	}

	@ResolveField('weeklyAggregation', () => [PersonalAccountWeeklyAggregationOutput])
	getAllWeeklyAggregatedData(
		@Parent() personalAccount: PersonalAccount
	): Promise<PersonalAccountWeeklyAggregationOutput[]> {
		return this.personalAccountDataAggregatorService.getAllWeeklyAggregatedData(personalAccount);
	}

	@ResolveField('yearlyAggregation', () => [PersonalAccountAggregationDataOutput])
	getAllYearlyAggregatedData(
		@Parent() personalAccount: PersonalAccount
	): Promise<PersonalAccountAggregationDataOutput[]> {
		return this.personalAccountDataAggregatorService.getAllYearlyAggregatedData(personalAccount);
	}
}
