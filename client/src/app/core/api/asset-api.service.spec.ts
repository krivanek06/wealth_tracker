import { TestBed } from '@angular/core/testing';

import { AssetApiService } from './asset-api.service';

describe('AssetApiService', () => {
  let service: AssetApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
