import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountActiveHoldingsTableComponent } from './investment-account-active-holdings-table.component';

describe('InvestmentAccountActiveHoldingsComponent', () => {
	let component: InvestmentAccountActiveHoldingsTableComponent;
	let fixture: ComponentFixture<InvestmentAccountActiveHoldingsTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [InvestmentAccountActiveHoldingsTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(InvestmentAccountActiveHoldingsTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
