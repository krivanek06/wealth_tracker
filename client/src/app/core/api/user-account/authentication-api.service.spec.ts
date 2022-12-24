import { TestBed } from '@angular/core/testing';

import { AuthenticationApiService } from './authentication-api.service';

describe('AuthenticationApiService', () => {
  let service: AuthenticationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
