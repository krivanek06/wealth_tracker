import { Module } from '@nestjs/common';
import { PersonalAccountMonthlyResolver } from './personal-account-monthly.resolver';
import { PersonalAccountMonthlyService } from './personal-account-monthly.service';

@Module({
	providers: [PersonalAccountMonthlyResolver, PersonalAccountMonthlyService],
	exports: [PersonalAccountMonthlyResolver, PersonalAccountMonthlyService],
})
export class PersonalAccountMonthlyModule {}
