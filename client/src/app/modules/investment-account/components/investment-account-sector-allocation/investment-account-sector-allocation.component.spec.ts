import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountSectorAllocationComponent } from './investment-account-sector-allocation.component';

describe('InvestmentAccountSectorAllocationComponent', () => {
  let component: InvestmentAccountSectorAllocationComponent;
  let fixture: ComponentFixture<InvestmentAccountSectorAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAccountSectorAllocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountSectorAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
