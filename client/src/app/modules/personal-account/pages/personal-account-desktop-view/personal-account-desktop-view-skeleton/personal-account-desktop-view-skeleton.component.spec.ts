import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountDesktopViewSkeletonComponent } from './personal-account-desktop-view-skeleton.component';

describe('PersonalAccountDesktopViewSkeletonComponent', () => {
  let component: PersonalAccountDesktopViewSkeletonComponent;
  let fixture: ComponentFixture<PersonalAccountDesktopViewSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountDesktopViewSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountDesktopViewSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
