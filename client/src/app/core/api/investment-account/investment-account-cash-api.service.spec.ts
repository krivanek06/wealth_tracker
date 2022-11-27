import { TestBed } from '@angular/core/testing';

import { InvestmentAccountCashApiService } from './investment-account-cash-api.service';

describe('InvestmentAccountCashApiService', () => {
  let service: InvestmentAccountCashApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentAccountCashApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
