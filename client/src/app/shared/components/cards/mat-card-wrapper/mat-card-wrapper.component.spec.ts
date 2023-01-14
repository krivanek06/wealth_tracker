import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCardWrapperComponent } from './mat-card-wrapper.component';

describe('MatCardWrapperComponent', () => {
	let component: MatCardWrapperComponent;
	let fixture: ComponentFixture<MatCardWrapperComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MatCardWrapperComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MatCardWrapperComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
