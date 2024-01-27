import { TestBed } from '@angular/core/testing';

import { AuthenticationAccountService } from './authentication-account.service';

describe('AuthenticationAccountService', () => {
  let service: AuthenticationAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
