import { TestBed } from '@angular/core/testing';

import { InvestmentAccountCacheService } from './investment-account-cache.service';

describe('InvestmentAccountCacheService', () => {
  let service: InvestmentAccountCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentAccountCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
