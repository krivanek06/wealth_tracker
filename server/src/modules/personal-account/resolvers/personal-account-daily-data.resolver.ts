import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { PersonalAccountDailyData } from '../entities';
import {
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
	PersonalAccountDailyDataQuery,
} from '../inputs';
import { PersonalAccountDailyDataEditOutput, PersonalAccountDailyDataOutput } from '../outputs';
import { PersonalAccountDailyService } from '../services';
import { AuthorizationGuard, RequestUser, ReqUser } from './../../../auth';
import { Input } from './../../../graphql/';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountDailyData)
export class PersonalAccountDailyResolver {
	constructor(private personalAccountDailyService: PersonalAccountDailyService) {}

	@Query(() => [PersonalAccountDailyDataOutput], {
		description: 'Returns queried daily data',
		defaultValue: [],
	})
	getPersonalAccountDailyData(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountDailyDataQuery
	): Promise<PersonalAccountDailyDataOutput[]> {
		return this.personalAccountDailyService.getPersonalAccountDailyData(input, authUser.id);
	}

	/* Mutations */
	@Mutation(() => PersonalAccountDailyDataOutput)
	createPersonalAccountDailyEntry(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountDailyDataCreate
	): Promise<PersonalAccountDailyDataOutput> {
		return this.personalAccountDailyService.createPersonalAccountDailyEntry(input, authUser.id);
	}

	@Mutation(() => PersonalAccountDailyDataEditOutput)
	editPersonalAccountDailyEntry(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountDailyDataEdit
	): Promise<PersonalAccountDailyDataEditOutput> {
		return this.personalAccountDailyService.editPersonalAccountDailyEntry(input, authUser.id);
	}

	@Mutation(() => PersonalAccountDailyDataOutput)
	deletePersonalAccountDailyEntry(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountDailyDataDelete
	): Promise<PersonalAccountDailyDataOutput> {
		return this.personalAccountDailyService.deletePersonalAccountDailyEntry(input, authUser.id);
	}
}
