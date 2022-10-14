import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
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
	],
	exports: [PersonalAccountResolver, PersonalAccountMonthlyResolver],
})
export class PersonalAccountModule {}
