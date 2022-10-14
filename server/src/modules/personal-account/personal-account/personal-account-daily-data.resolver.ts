import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from './../../../auth';
import { Input } from './../../../graphql';
import { PersonalAccountDailyDataCreate } from './dto';
import { PersonalAccountDailyData } from './entity';
import { PersonalAccountDailyService } from './personal-account-daily-data.service';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountDailyData)
export class PersonalAccountDailyResolver {
	constructor(private personalAccountDailyService: PersonalAccountDailyService) {}

	/* Mutations */

	@Mutation(() => PersonalAccountDailyData)
	async createPersonalAccountDailyEntry(
		@ReqUser() authUser: RequestUser,
		@Input() input: PersonalAccountDailyDataCreate
	): Promise<PersonalAccountDailyData> {
		return this.personalAccountDailyService.createPersonalAccountDailyEntry(input, authUser.id);
	}
}
