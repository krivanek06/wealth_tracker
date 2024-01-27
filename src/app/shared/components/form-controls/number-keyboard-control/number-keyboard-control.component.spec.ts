import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberKeyboardComponent } from './number-keyboard-control.component';

describe('NumberKeyboardComponent', () => {
	let component: NumberKeyboardComponent;
	let fixture: ComponentFixture<NumberKeyboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NumberKeyboardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NumberKeyboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
