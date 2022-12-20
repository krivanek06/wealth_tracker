import { TestBed } from '@angular/core/testing';

import { ResolveTokenGuard } from './resolve-token.guard';

describe('ResolveTokenGuard', () => {
  let guard: ResolveTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResolveTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
