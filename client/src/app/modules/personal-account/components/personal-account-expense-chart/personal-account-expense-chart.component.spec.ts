import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountExpenseChartComponent } from './personal-account-expense-chart.component';

describe('PersonalAccountExpenseChartComponent', () => {
  let component: PersonalAccountExpenseChartComponent;
  let fixture: ComponentFixture<PersonalAccountExpenseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountExpenseChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountExpenseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
