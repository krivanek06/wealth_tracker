import { TestBed } from '@angular/core/testing';

import { PersonalAccountFacadeService } from './personal-account-facade.service';

describe('PersonalAccountFacadeService', () => {
  let service: PersonalAccountFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalAccountFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
