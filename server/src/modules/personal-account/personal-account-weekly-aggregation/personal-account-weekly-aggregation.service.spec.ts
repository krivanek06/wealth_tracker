import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccountWeeklyAggregationService } from './personal-account-weekly-aggregation.service';

describe('PersonalAccountWeeklyAggregationService', () => {
  let service: PersonalAccountWeeklyAggregationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalAccountWeeklyAggregationService],
    }).compile();

    service = module.get<PersonalAccountWeeklyAggregationService>(PersonalAccountWeeklyAggregationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
