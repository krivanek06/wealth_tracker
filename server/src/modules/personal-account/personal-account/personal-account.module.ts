import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalAccountDailyResolver } from './personal-account-daily-data.resolver';
import { PersonalAccountDailyService } from './personal-account-daily-data.service';
import { PersonalAccountMonthlyResolver } from './personal-account-monthly.resolver';
import { PersonalAccountMonthlyService } from './personal-account-monthly.service';
import { PersonalAccountResolver } from './personal-account.resolver';
import { PersonalAccountService } from './personal-account.service';

@Module({
	providers: [
		PersonalAccountService,
		PersonalAccountResolver,
		PersonalAccountMonthlyResolver,
		PersonalAccountMonthlyService,
		PrismaService,
		PersonalAccountDailyService,
		PersonalAccountDailyResolver,
	],
	exports: [PersonalAccountResolver, PersonalAccountMonthlyResolver, PersonalAccountDailyResolver],
})
export class PersonalAccountModule {}
