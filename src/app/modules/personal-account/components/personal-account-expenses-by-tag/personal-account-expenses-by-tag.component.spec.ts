import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountExpensesByTagComponent } from './personal-account-expenses-by-tag.component';

describe('PersonalAccountExpensesByTagsComponent', () => {
	let component: PersonalAccountExpensesByTagComponent;
	let fixture: ComponentFixture<PersonalAccountExpensesByTagComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PersonalAccountExpensesByTagComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PersonalAccountExpensesByTagComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
