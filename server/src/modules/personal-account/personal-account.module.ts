import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
	PersonalAccountDailyResolver,
	PersonalAccountMonthlyResolver,
	PersonalAccountResolver,
	PersonalAccountTagResolver,
} from './resolvers';
import {
	PersonalAccounDataAggregatorService,
	PersonalAccountDailyService,
	PersonalAccountMonthlyService,
	PersonalAccountService,
	PersonalAccountTagService,
} from './services';

@Module({
	providers: [
		PersonalAccountService,
		PersonalAccountResolver,
		PersonalAccountMonthlyResolver,
		PersonalAccountMonthlyService,
		PrismaService,
		PersonalAccountDailyService,
		PersonalAccountDailyResolver,
		PersonalAccountTagService,
		PersonalAccountTagResolver,
		PersonalAccounDataAggregatorService,
	],
	exports: [
		PersonalAccountResolver,
		PersonalAccountMonthlyResolver,
		PersonalAccountDailyResolver,
		PersonalAccountTagResolver,
	],
})
export class PersonalAccountModule {}
