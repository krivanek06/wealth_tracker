import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountTransactionsComponent } from './investment-account-transactions.component';

describe('InvestmentAccountTransactionsComponent', () => {
  let component: InvestmentAccountTransactionsComponent;
  let fixture: ComponentFixture<InvestmentAccountTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
