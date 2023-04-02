import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountPortfolioGrowthActionComponent } from './investment-account-portfolio-growth-action.component';

describe('InvestmentAccountPortfolioGrowthActionComponent', () => {
  let component: InvestmentAccountPortfolioGrowthActionComponent;
  let fixture: ComponentFixture<InvestmentAccountPortfolioGrowthActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InvestmentAccountPortfolioGrowthActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountPortfolioGrowthActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
