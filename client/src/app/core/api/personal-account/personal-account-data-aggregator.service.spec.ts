import { TestBed } from '@angular/core/testing';

import { PersonalAccountDataAggregatorService } from './personal-account-data-aggregator.service';

describe('PersonalAccountDataAggregatorService', () => {
  let service: PersonalAccountDataAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalAccountDataAggregatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
