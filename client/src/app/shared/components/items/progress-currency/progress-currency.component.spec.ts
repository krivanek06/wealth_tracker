import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCurrencyComponent } from './progress-currency.component';

describe('ProgressItemComponent', () => {
	let component: ProgressCurrencyComponent;
	let fixture: ComponentFixture<ProgressCurrencyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProgressCurrencyComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ProgressCurrencyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
