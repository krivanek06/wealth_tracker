import { Module } from '@nestjs/common';
import { PersonalAccountWeeklyAggregationResolver } from './personal-account-weekly-aggregation.resolver';
import { PersonalAccountWeeklyAggregationService } from './personal-account-weekly-aggregation.service';

@Module({
	providers: [PersonalAccountWeeklyAggregationResolver, PersonalAccountWeeklyAggregationService],
	exports: [PersonalAccountWeeklyAggregationResolver, PersonalAccountWeeklyAggregationService],
})
export class PersonalAccountWeeklyAggregationModule {}
