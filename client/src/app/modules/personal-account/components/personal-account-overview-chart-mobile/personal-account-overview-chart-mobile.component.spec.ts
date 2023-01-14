import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountOverviewChartMobileComponent } from './personal-account-overview-chart-mobile.component';

describe('PersonalAccountOverviewChartMobileComponent', () => {
  let component: PersonalAccountOverviewChartMobileComponent;
  let fixture: ComponentFixture<PersonalAccountOverviewChartMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountOverviewChartMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountOverviewChartMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
