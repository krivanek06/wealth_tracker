import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountComponent } from './investment-account.component';

describe('InvestmentAccountComponent', () => {
  let component: InvestmentAccountComponent;
  let fixture: ComponentFixture<InvestmentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
