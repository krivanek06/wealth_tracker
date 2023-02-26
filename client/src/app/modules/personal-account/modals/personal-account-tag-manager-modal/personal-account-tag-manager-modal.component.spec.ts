import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountTagManagerModalComponent } from './personal-account-tag-manager-modal.component';

describe('PersonalAccountTagManagerModalComponent', () => {
  let component: PersonalAccountTagManagerModalComponent;
  let fixture: ComponentFixture<PersonalAccountTagManagerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountTagManagerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountTagManagerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
