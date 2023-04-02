import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountGrowthAssetsComponent } from './investment-account-growth-assets.component';

describe('InvestmentAccountGrowthAssetsComponent', () => {
  let component: InvestmentAccountGrowthAssetsComponent;
  let fixture: ComponentFixture<InvestmentAccountGrowthAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InvestmentAccountGrowthAssetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountGrowthAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
