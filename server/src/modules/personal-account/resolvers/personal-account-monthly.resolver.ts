import { UseGuards } from '@nestjs/common';
import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountMonthlyService } from '../services';
import { AuthorizationGuard } from './../../../auth';

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
