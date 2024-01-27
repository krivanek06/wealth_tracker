import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountDailyDataEntryComponent } from './personal-account-daily-data-entry.component';

describe('PersonalAccountDailyDataEntryComponent', () => {
  let component: PersonalAccountDailyDataEntryComponent;
  let fixture: ComponentFixture<PersonalAccountDailyDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountDailyDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountDailyDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
