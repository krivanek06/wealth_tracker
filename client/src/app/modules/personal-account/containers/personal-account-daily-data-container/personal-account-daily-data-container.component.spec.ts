import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountDailyDataContainerComponent } from './personal-account-daily-data-container.component';

describe('PersonalAccountDailyDataContainerComponent', () => {
  let component: PersonalAccountDailyDataContainerComponent;
  let fixture: ComponentFixture<PersonalAccountDailyDataContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountDailyDataContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountDailyDataContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
