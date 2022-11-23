import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountCashChangeComponent } from './investment-account-cash-change.component';

describe('InvestmentAccountCashChangeComponent', () => {
  let component: InvestmentAccountCashChangeComponent;
  let fixture: ComponentFixture<InvestmentAccountCashChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountCashChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountCashChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
