import { Module } from '@nestjs/common';
import { GraphQLPubsubBackendModule } from '../../graphql';
import { PrismaService } from '../../prisma';
import { PersonalAccountMonthlyDataRepository, PersonalAccountRepositoryService } from './repository';
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
	imports: [GraphQLPubsubBackendModule],
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
		PersonalAccountMonthlyDataRepository,
	],
	exports: [
		PersonalAccountResolver,
		PersonalAccountMonthlyResolver,
		PersonalAccountDailyResolver,
		PersonalAccountTagResolver,
	],
})
export class PersonalAccountModule {}
