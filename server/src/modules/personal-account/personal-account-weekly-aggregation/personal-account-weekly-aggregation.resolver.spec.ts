import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountWeeklyAggregationResolver } from './personal-account-weekly-aggregation.resolver';

describe('PersonalAccountWeeklyAggregationResolver', () => {
  let resolver: PersonalAccountWeeklyAggregationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalAccountWeeklyAggregationResolver],
    }).compile();

    resolver = module.get<PersonalAccountWeeklyAggregationResolver>(PersonalAccountWeeklyAggregationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
