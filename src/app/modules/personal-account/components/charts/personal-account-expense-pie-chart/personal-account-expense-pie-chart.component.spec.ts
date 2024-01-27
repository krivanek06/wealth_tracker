import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountExpensePieChartComponent } from '../expense-pie-chart/expense-pie-chart.component';

describe('PersonalAccountTagAllocationChartComponent', () => {
	let component: PersonalAccountExpensePieChartComponent;
	let fixture: ComponentFixture<PersonalAccountExpensePieChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PersonalAccountExpensePieChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PersonalAccountExpensePieChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
