import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountDailyEntriesTableMobileComponent } from './personal-account-daily-entries-table-mobile.component';

describe('PersonalAccountDailyEntriesTableMobileComponent', () => {
  let component: PersonalAccountDailyEntriesTableMobileComponent;
  let fixture: ComponentFixture<PersonalAccountDailyEntriesTableMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountDailyEntriesTableMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountDailyEntriesTableMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
