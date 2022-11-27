import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingHistoryItemComponent } from './holding-history-item.component';

describe('HoldingHistoryItemComponent', () => {
  let component: HoldingHistoryItemComponent;
  let fixture: ComponentFixture<HoldingHistoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldingHistoryItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldingHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
