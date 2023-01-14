import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountDesktopViewComponent } from './personal-account-desktop-view.component';

describe('PersonalAccountDesktopViewComponent', () => {
  let component: PersonalAccountDesktopViewComponent;
  let fixture: ComponentFixture<PersonalAccountDesktopViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountDesktopViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountDesktopViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
