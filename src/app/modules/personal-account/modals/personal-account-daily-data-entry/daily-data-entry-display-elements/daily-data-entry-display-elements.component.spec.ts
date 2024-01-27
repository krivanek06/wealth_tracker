import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDataEntryDisplayElementsComponent } from './daily-data-entry-display-elements.component';

describe('DailyDataEntryDisplayElementsComponent', () => {
  let component: DailyDataEntryDisplayElementsComponent;
  let fixture: ComponentFixture<DailyDataEntryDisplayElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyDataEntryDisplayElementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyDataEntryDisplayElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
