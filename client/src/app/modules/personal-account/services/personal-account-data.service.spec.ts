import { TestBed } from '@angular/core/testing';

import { PersonalAccountDataService } from './personal-account-data.service';

describe('PersonalAccountDataService', () => {
  let service: PersonalAccountDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalAccountDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
