import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountDisplayToggleComponent } from './personal-account-display-toggle.component';

describe('PersonalAccountDisplayToggleComponent', () => {
  let component: PersonalAccountDisplayToggleComponent;
  let fixture: ComponentFixture<PersonalAccountDisplayToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountDisplayToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountDisplayToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
