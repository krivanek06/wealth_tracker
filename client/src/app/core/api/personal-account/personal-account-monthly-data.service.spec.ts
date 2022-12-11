import { TestBed } from '@angular/core/testing';

import { PersonalAccountMonthlyDataService } from './personal-account-monthly-data.service';

describe('PersonalAccountMonthlyDataService', () => {
  let service: PersonalAccountMonthlyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalAccountMonthlyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
