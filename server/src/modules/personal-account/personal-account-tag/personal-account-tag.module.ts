import { Module } from '@nestjs/common';
import { PersonalAccountTagResolver } from './personal-account-tag.resolver';
import { PersonalAccountTagService } from './personal-account-tag.service';

@Module({
	providers: [PersonalAccountTagService, PersonalAccountTagResolver],
	exports: [PersonalAccountTagService, PersonalAccountTagResolver],
})
export class PersonalAccountTagModule {}
