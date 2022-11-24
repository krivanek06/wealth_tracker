import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountTransactionTableComponent } from './investment-account-transaction-table.component';

describe('InvestmentAccountTransactionTableComponent', () => {
  let component: InvestmentAccountTransactionTableComponent;
  let fixture: ComponentFixture<InvestmentAccountTransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountTransactionTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountTransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
