import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountPortfolioGrowthComponent } from './investment-account-portfolio-growth.component';

describe('InvestmentAccountPortfolioGrowthComponent', () => {
  let component: InvestmentAccountPortfolioGrowthComponent;
  let fixture: ComponentFixture<InvestmentAccountPortfolioGrowthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InvestmentAccountPortfolioGrowthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountPortfolioGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
