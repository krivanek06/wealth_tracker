import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountGrowthChartComponent } from './personal-account-growth-chart.component';

describe('PersonalAccountGrowthChartComponent', () => {
  let component: PersonalAccountGrowthChartComponent;
  let fixture: ComponentFixture<PersonalAccountGrowthChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountGrowthChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountGrowthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
