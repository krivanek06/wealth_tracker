import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountPortfolioGrowthChartComponent } from './investment-account-portfolio-growth-chart.component';

describe('InvestmentAccountPortfolioGrowthChartComponent', () => {
  let component: InvestmentAccountPortfolioGrowthChartComponent;
  let fixture: ComponentFixture<InvestmentAccountPortfolioGrowthChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountPortfolioGrowthChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountPortfolioGrowthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
