import { TestBed } from '@angular/core/testing';

import { InvestmentAccountApiService } from './investment-account-api.service';

describe('InvestmentAccountApiService', () => {
  let service: InvestmentAccountApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentAccountApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
