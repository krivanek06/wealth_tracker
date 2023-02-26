import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountAccountGrowthChartComponent } from './personal-account-account-growth-chart.component';

describe('PersonalAccountAccountGrowthChartComponent', () => {
  let component: PersonalAccountAccountGrowthChartComponent;
  let fixture: ComponentFixture<PersonalAccountAccountGrowthChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountAccountGrowthChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountAccountGrowthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
