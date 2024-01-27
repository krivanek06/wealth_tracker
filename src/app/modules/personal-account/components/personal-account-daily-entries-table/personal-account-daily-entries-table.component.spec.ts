import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountDailyEntriesTableComponent } from './personal-account-daily-entries-table.component';

describe('PersonalAccountDailyEntriesTableComponent', () => {
  let component: PersonalAccountDailyEntriesTableComponent;
  let fixture: ComponentFixture<PersonalAccountDailyEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountDailyEntriesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountDailyEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
