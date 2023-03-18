import { TestBed } from '@angular/core/testing';

import { AccountManagerApiService } from './account-manager-api.service';

describe('AccountManagerApiService', () => {
  let service: AccountManagerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountManagerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
