import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountMobileViewComponent } from './personal-account-mobile-view.component';

describe('PersonalAccountMobileViewComponent', () => {
  let component: PersonalAccountMobileViewComponent;
  let fixture: ComponentFixture<PersonalAccountMobileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountMobileViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
