import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountSkeletonComponent } from './investment-account-skeleton.component';

describe('InvestmentAccountSkeletonComponent', () => {
  let component: InvestmentAccountSkeletonComponent;
  let fixture: ComponentFixture<InvestmentAccountSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InvestmentAccountSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
