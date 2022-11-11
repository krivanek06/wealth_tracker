import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PersonalAccountDailyData, PersonalAccountTag } from '../entities';
import {
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
} from '../inputs';
import { PersonalAccountDailyDataEditOutput } from '../outputs';
import { PersonalAccountDailyService, PersonalAccountTagService } from '../services';
import { AuthorizationGuard, RequestUser, ReqUser } from './../../../auth';
import { Input } from './../../../graphql/';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountDailyData)
export class PersonalAccountDailyResolver {
	constructor(
		private personalAccountDailyService: PersonalAccountDailyService,
		private personalAccountTagService: PersonalAccountTagService
	) {}

	/* Mutations */

	@Mutation(() => PersonalAccountDailyData)
	async createPersonalAccountDailyEntry(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountDailyDataCreate
	): Promise<PersonalAccountDailyData> {
		return this.personalAccountDailyService.createPersonalAccountDailyEntry(input, authUser.id);
	}

	@Mutation(() => PersonalAccountDailyDataEditOutput)
	async editPersonalAccountDailyEntry(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountDailyDataEdit
	): Promise<PersonalAccountDailyDataEditOutput> {
		return this.personalAccountDailyService.editPersonalAccountDailyEntry(input, authUser.id);
	}

	@Mutation(() => PersonalAccountDailyData)
	async deletePersonalAccountDailyEntry(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountDailyDataDelete
	): Promise<PersonalAccountDailyData> {
		return this.personalAccountDailyService.deletePersonalAccountDailyEntry(input, authUser.id);
	}

	/* Resolvers */
	@ResolveField('tag', () => PersonalAccountTag)
	getMonthlyDataDailyEntries(@Parent() dailyData: PersonalAccountDailyData): PersonalAccountTag {
		return this.personalAccountTagService.getDefaultTagById(dailyData.tagId);
	}
}
