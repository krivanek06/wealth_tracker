import { TestBed } from '@angular/core/testing';

import { InvestmentAccountHoldingService } from './investment-account-holding.service';

describe('InvestmentAccountHoldingService', () => {
  let service: InvestmentAccountHoldingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentAccountHoldingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
