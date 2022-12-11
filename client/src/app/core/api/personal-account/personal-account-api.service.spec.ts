import { TestBed } from '@angular/core/testing';

import { PersonalAccountApiService } from './personal-account-api.service';

describe('PersonalAccountApiService', () => {
	let service: PersonalAccountApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PersonalAccountApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
