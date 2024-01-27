import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountActionButtonsComponent } from './personal-account-action-buttons.component';

describe('PersonalAccountActionButtonsComponent', () => {
  let component: PersonalAccountActionButtonsComponent;
  let fixture: ComponentFixture<PersonalAccountActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountActionButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
