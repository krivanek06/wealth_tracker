import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeInvestmentAccountComponent } from './welcome-investment-account.component';

describe('WelcomeInvestmentAccountComponent', () => {
  let component: WelcomeInvestmentAccountComponent;
  let fixture: ComponentFixture<WelcomeInvestmentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WelcomeInvestmentAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeInvestmentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
