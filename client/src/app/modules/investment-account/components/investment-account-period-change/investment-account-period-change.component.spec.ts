import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountPeriodChangeComponent } from './investment-account-period-change.component';

describe('InvestmentAccountPeriodChangeComponent', () => {
  let component: InvestmentAccountPeriodChangeComponent;
  let fixture: ComponentFixture<InvestmentAccountPeriodChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountPeriodChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountPeriodChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
