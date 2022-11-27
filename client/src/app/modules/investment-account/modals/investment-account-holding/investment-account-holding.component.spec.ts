import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountHoldingComponent } from './investment-account-holding.component';

describe('InvestmentAccountHoldingComponent', () => {
  let component: InvestmentAccountHoldingComponent;
  let fixture: ComponentFixture<InvestmentAccountHoldingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountHoldingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountHoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
