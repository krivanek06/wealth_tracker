import { Module } from '@nestjs/common';
import { PersonalAccountResolver } from './personal-account.resolver';
import { PersonalAccountService } from './personal-account.service';

@Module({
	providers: [PersonalAccountService, PersonalAccountResolver],
	exports: [PersonalAccountService, PersonalAccountResolver],
})
export class PersonalAccountModule {}
