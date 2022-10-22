import { TestBed } from '@angular/core/testing';

import { PreloadDataService } from './preload-data.service';

describe('PreloadDataService', () => {
  let service: PreloadDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreloadDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
