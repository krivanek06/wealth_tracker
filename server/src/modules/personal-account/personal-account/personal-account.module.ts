import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalAccountMonthlyService } from './personal-account-monthly.service';
import { PersonalAccountResolver } from './personal-account.resolver';
import { PersonalAccountService } from './personal-account.service';

@Module({
	providers: [PersonalAccountService, PersonalAccountResolver, PersonalAccountMonthlyService, PrismaService],
	exports: [PersonalAccountResolver],
})
export class PersonalAccountModule {}
