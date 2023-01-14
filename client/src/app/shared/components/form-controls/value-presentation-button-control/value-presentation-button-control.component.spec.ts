import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuePresentationButtonControlComponent } from './value-presentation-button-control.component';

describe('ValuePresentationItemComponent', () => {
	let component: ValuePresentationButtonControlComponent;
	let fixture: ComponentFixture<ValuePresentationButtonControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ValuePresentationButtonControlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ValuePresentationButtonControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
