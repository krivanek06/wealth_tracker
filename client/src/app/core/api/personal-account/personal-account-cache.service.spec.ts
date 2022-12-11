import { TestBed } from '@angular/core/testing';

import { PersonalAccountCacheService } from './personal-account-cache.service';

describe('PersonalAccountCacheService', () => {
  let service: PersonalAccountCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalAccountCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
