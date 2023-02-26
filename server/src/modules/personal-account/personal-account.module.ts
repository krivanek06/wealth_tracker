import { Module } from '@nestjs/common';
import { GraphQLPubsubBackendModule } from '../../graphql';
import { PrismaService } from '../../prisma';
import { StorageFilesModule } from '../../providers';
import { PersonalAccountMonthlyDataRepositoryService, PersonalAccountRepositoryService } from './repository';
import {
	PersonalAccountDailyResolver,
	PersonalAccountMonthlyResolver,
	PersonalAccountResolver,
	PersonalAccountTagResolver,
} from './resolvers';
import {
	PersonalAccountDailyService,
	PersonalAccountDataAggregatorService,
	PersonalAccountMonthlyService,
	PersonalAccountService,
	PersonalAccountTagService,
} from './services';

@Module({
	imports: [GraphQLPubsubBackendModule, StorageFilesModule],
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
		PersonalAccountDataAggregatorService,
		PersonalAccountRepositoryService,
		PersonalAccountMonthlyDataRepositoryService,
	],
	exports: [
		PersonalAccountResolver,
		PersonalAccountMonthlyResolver,
		PersonalAccountDailyResolver,
		PersonalAccountTagResolver,
	],
})
export class PersonalAccountModule {}
