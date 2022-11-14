import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountActiveHoldingsComponent } from './investment-account-active-holdings.component';

describe('InvestmentAccountActiveHoldingsComponent', () => {
  let component: InvestmentAccountActiveHoldingsComponent;
  let fixture: ComponentFixture<InvestmentAccountActiveHoldingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountActiveHoldingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountActiveHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
