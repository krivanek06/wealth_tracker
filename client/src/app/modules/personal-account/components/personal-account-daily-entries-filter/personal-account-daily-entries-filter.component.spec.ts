import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountDailyEntriesFilterComponent } from './personal-account-daily-entries-filter.component';

describe('PersonalAccountDailyEntriesFilterComponent', () => {
  let component: PersonalAccountDailyEntriesFilterComponent;
  let fixture: ComponentFixture<PersonalAccountDailyEntriesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountDailyEntriesFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountDailyEntriesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
