import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountOverviewChartComponent } from './personal-account-tag-spending-chart.component';

describe('PersonalAccountOverviewChartComponent', () => {
	let component: PersonalAccountOverviewChartComponent;
	let fixture: ComponentFixture<PersonalAccountOverviewChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PersonalAccountOverviewChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PersonalAccountOverviewChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
