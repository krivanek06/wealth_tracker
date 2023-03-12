import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAccountActionButtonsComponent } from './investment-account-action-buttons.component';

describe('InvestmentAccountActionButtonsComponent', () => {
  let component: InvestmentAccountActionButtonsComponent;
  let fixture: ComponentFixture<InvestmentAccountActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InvestmentAccountActionButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentAccountActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
