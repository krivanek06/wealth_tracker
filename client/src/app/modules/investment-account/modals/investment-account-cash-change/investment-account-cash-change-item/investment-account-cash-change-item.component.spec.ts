import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountCashChangeItemComponent } from './investment-account-cash-change-item.component';

describe('InvestmentAccountCashChangeItemComponent', () => {
  let component: InvestmentAccountCashChangeItemComponent;
  let fixture: ComponentFixture<InvestmentAccountCashChangeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountCashChangeItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountCashChangeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
