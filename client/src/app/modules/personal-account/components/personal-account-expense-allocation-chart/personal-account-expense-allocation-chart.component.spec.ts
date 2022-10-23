import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountExpenseAllocationChartComponent } from './personal-account-expense-allocation-chart.component';

describe('PersonalAccountExpenseAllocationChartComponent', () => {
  let component: PersonalAccountExpenseAllocationChartComponent;
  let fixture: ComponentFixture<PersonalAccountExpenseAllocationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountExpenseAllocationChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountExpenseAllocationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
