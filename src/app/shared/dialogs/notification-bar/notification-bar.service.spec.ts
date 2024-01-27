import { TestBed } from '@angular/core/testing';
import { NotificationProgressService } from './notification-bar.service';

describe('NotificationProgressService', () => {
	let service: NotificationProgressService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotificationProgressService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
