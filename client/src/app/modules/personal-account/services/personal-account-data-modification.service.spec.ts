import { TestBed } from '@angular/core/testing';

import { PersonalAccountDataModificationService } from './personal-account-data-modification.service';

describe('PersonalAccountDataModificationService', () => {
  let service: PersonalAccountDataModificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalAccountDataModificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
