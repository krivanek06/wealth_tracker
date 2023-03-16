import { TestBed } from '@angular/core/testing';

import { VerifyAuthentication } from './verify-authentication.guard';

describe('ResolveTokenGuard', () => {
	let guard: VerifyAuthentication;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		guard = TestBed.inject(VerifyAuthentication);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});
});
