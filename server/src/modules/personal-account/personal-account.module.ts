import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
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
	],
	exports: [
		PersonalAccountResolver,
		PersonalAccountMonthlyResolver,
		PersonalAccountDailyResolver,
		PersonalAccountTagResolver,
	],
})
export class PersonalAccountModule {}
