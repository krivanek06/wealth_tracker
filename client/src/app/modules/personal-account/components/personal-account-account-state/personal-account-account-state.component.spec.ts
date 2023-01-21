import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountAccountStateComponent } from './personal-account-account-state.component';

describe('PersonalAccountAccountStateComponent', () => {
  let component: PersonalAccountAccountStateComponent;
  let fixture: ComponentFixture<PersonalAccountAccountStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountAccountStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountAccountStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
