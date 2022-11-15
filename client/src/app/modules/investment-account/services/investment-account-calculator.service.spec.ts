import { TestBed } from '@angular/core/testing';

import { InvestmentAccountCalculatorService } from './investment-account-calculator.service';

describe('InvestmentAccountCalculatorService', () => {
  let service: InvestmentAccountCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentAccountCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
