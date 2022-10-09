import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalAccountMonthlyResolver } from './personal-account-monthly.resolver';
import { PersonalAccountMonthlyService } from './personal-account-monthly.service';

@Module({
	providers: [PersonalAccountMonthlyResolver, PersonalAccountMonthlyService, PrismaService],
	exports: [PersonalAccountMonthlyResolver, PersonalAccountMonthlyService],
})
export class PersonalAccountMonthlyModule {}
