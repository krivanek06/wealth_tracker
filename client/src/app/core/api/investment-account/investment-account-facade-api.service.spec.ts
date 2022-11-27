import { TestBed } from '@angular/core/testing';

import { InvestmentAccountFacadeApiService } from './investment-account-facade-api.service';

describe('InvestmentAccountFacadeApiService', () => {
  let service: InvestmentAccountFacadeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentAccountFacadeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
