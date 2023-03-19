import { TestBed } from '@angular/core/testing';

import { AccountManagerCacheService } from './account-manager-cache.service';

describe('AccountManagerCacheService', () => {
  let service: AccountManagerCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountManagerCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
