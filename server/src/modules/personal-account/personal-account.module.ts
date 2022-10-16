import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
	PersonalAccountDailyResolver,
	PersonalAccountMonthlyResolver,
	PersonalAccountResolver,
	PersonalAccountTagResolver,
} from './resolvers';
import {
	PersonalAccountDailyService,
	PersonalAccountMonthlyService,
	PersonalAccountService,
	PersonalAccountTagService,
	PersonalAccountWeeklyService,
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
		PersonalAccountWeeklyService,
	],
	exports: [
		PersonalAccountResolver,
		PersonalAccountMonthlyResolver,
		PersonalAccountDailyResolver,
		PersonalAccountTagResolver,
	],
})
export class PersonalAccountModule {}
