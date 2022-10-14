import { UseGuards } from '@nestjs/common';
import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from './../../../auth';
import { PersonalAccountMonthlyData } from './entity';
import { PersonalAccountMonthlyService } from './personal-account-monthly.service';

@UseGuards(AuthorizationGuard)
@Resolver(() => PersonalAccountMonthlyData)
export class PersonalAccountMonthlyResolver {
	constructor(private personalAccountMonthlyService: PersonalAccountMonthlyService) {}

	/* Resolvers */

	@ResolveField('totalDaily', () => Int)
	async getMonthlyDataDailyEntries(@Parent() personalAccountMonthlyData: PersonalAccountMonthlyData): Promise<number> {
		return this.personalAccountMonthlyService.getMonthlyDataDailyEntries(personalAccountMonthlyData);
	}
}
