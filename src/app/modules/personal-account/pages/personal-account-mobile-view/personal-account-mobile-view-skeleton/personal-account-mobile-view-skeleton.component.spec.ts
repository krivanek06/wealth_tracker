import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountMobileViewSkeletonComponent } from './personal-account-mobile-view-skeleton.component';

describe('PersonalAccountMobileViewSkeletonComponent', () => {
  let component: PersonalAccountMobileViewSkeletonComponent;
  let fixture: ComponentFixture<PersonalAccountMobileViewSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountMobileViewSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountMobileViewSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
