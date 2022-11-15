import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountStateComponent } from './investment-account-state.component';

describe('InvestmentAccountStateComponent', () => {
  let component: InvestmentAccountStateComponent;
  let fixture: ComponentFixture<InvestmentAccountStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
