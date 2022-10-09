import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalAccountTagResolver } from './personal-account-tag.resolver';
import { PersonalAccountTagService } from './personal-account-tag.service';

@Module({
	providers: [PersonalAccountTagService, PersonalAccountTagResolver, PrismaService],
	exports: [PersonalAccountTagService, PersonalAccountTagResolver],
})
export class PersonalAccountTagModule {}
